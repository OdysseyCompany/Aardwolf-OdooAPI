import json
import logging

from odoo.http import request, Response

from odoo import http
from odoo.addons.jwt_provider.JwtRequest import jwt_request
from ..util import response

_logger = logging.getLogger(__name__)


class APIWebsite(http.Controller):

    @http.route("/api/v1/get_categories", type="json", auth='public', csrf=False, cors='*', methods=['GET'])
    def api_get_categories(self, **payload):
        try:
            result = {}
            limit_per_category = 6  # Giới hạn mỗi danh mục 5 sản phẩm

            # Lấy domain hệ thống từ config
            base_url = request.env['ir.config_parameter'].sudo().get_param('web.base.url')

            # Truy vấn tất cả sản phẩm
            products = request.env['product.template'].sudo().search_read(
                fields=['name', 'list_price', 'categ_id', 'image_1920']
            )

            # Nhóm sản phẩm theo danh mục với giới hạn
            for prod in products:
                category_name = prod.get('categ_id', [0, "No Category"])[1]

                # Khởi tạo danh sách nếu chưa tồn tại
                if category_name not in result:
                    result[category_name] = []
                # Tạo URL ảnh
                image_url = f"{base_url}/web/image/product.template/{prod.get('id')}/image_128" if prod.get(
                    'image_1920') else None

                # Thêm sản phẩm nếu chưa đạt đến giới hạn
                if len(result[category_name]) < limit_per_category:
                    result[category_name].append({
                        "name": prod['name'],
                        "list_price": prod['list_price'],
                        "image_url": image_url
                    })

            return result

        except Exception as error:
            return {
                "status": 500,
                "message": "Server error",
                "error": str(error)
            }

    @http.route("/api/v1/get-detail-categories", type="json", auth='public', csrf=False, cors='*', methods=['GET'])
    def api_get_detail_categories(self, **payload):
        try:
            payload = request.get_json_data()
            values = {}
            for k, v in payload.items():
                values[k] = v
            field_require = {
                'slug': 'Category',
            }
            check_result = response.check_field_require(field_require, payload)
            if check_result:
                return jwt_request.response(check_result)
            result = {}
            # Lấy domain hệ thống từ config
            base_url = request.env['ir.config_parameter'].sudo().get_param('web.base.url')

            # Truy vấn tất cả sản phẩm
            products = request.env['product.template'].sudo().search_read(
                domain=[('categ_id.slug', '=', payload['slug'])],
                fields=['slug', 'name', 'list_price', 'categ_id', 'image_1920']
            )

            # Nhóm sản phẩm theo danh mục với giới hạn
            for prod in products:
                category_name = prod.get('categ_id', [0, "No Category"])[1]

                # Khởi tạo danh sách nếu chưa tồn tại
                if category_name not in result:
                    result[category_name] = []
                # Tạo URL ảnh
                image_url = f"{base_url}/web/image/product.template/{prod.get('id')}/image_128" if prod.get(
                    'image_1920') else None

                # Thêm sản phẩm nếu chưa đạt đến giới hạn
                result[category_name].append({
                    "slug": prod['slug'],
                    "name": prod['name'],
                    "list_price": prod['list_price'],
                    "image_url": image_url
                })

            return result

        except Exception as error:
            return {
                "status": 500,
                "message": "Server error",
                "error": str(error)
            }

    @http.route("/api/v1/get-data-product", type="http", auth='public', csrf=False, cors='*', methods=['GET'])
    def api_get_product(self, **payload):
        try:
            result = []

            # Lấy domain hệ thống từ config
            base_url = request.env['ir.config_parameter'].sudo().get_param('web.base.url')

            # Truy vấn tất cả sản phẩm
            products = request.env['product.template'].sudo().search_read(
                fields=['name', 'list_price', 'slug', 'image_1920'], limit=10
            )

            # Nhóm sản phẩm theo danh mục với giới hạn
            for prod in products:
                # Tạo URL ảnh
                image_url = f"{base_url}/web/image/product.template/{prod.get('id')}/image_256" if prod.get(
                    'image_1920') else None
                result.append({
                    'img': image_url,
                    "name": prod['name'],
                    "list_price": prod['list_price'],
                    "slug": prod['slug'],
                })
            return Response(
                json.dumps({'result': result}),
                content_type='application/json',
                status=200
            )

        except Exception as error:
            return {
                "status": 500,
                "message": "Server error",
                "error": str(error)
            }

    @http.route("/api/v1/get-data-categories", type="http", auth='public', csrf=False, cors='*', methods=['GET'])
    def api_get_categories(self, **payload):
        try:
            # Lấy tất cả category cha (ví dụ: cấp 1, không có parent)
            categories = request.env['product.public.category'].sudo().search([('parent_id', '=', False)], limit=5)

            result = []
            for category in categories:
                # Tạo danh sách con
                children = [{
                    'name': child.name,
                    'slug': child.slug,
                } for child in category.child_id]

                result.append({
                    'name': category.name,
                    'slug': category.slug,
                    'children': children,
                    'image': f"/web/image/product.public.category/{category.id}/image_1920",
                })

            return Response(
                json.dumps({'result': result}),
                content_type='application/json',
                status=200
            )

        except Exception as error:
            return Response(
                json.dumps({
                    "status": 500,
                    "message": "Server error",
                    "error": str(error)
                }),
                content_type='application/json',
                status=500
            )

    @http.route("/api/v1/get-data-industries", type="http", auth='public', csrf=False, cors='*', methods=['GET'])
    def api_get_industries(self, **payload):
        try:
            # Lấy tất cả category cha (ví dụ: cấp 1, không có parent)
            industries = request.env['product.industries'].sudo().search([], limit=5)

            result = []
            for indus in industries:
                result.append({
                    'name': indus.name,
                    'slug': indus.slug,
                    'image': f"/web/image/product.industries/{indus.id}/image_1920",
                })

            return Response(
                json.dumps({'result': result}),
                content_type='application/json',
                status=200
            )

        except Exception as error:
            return Response(
                json.dumps({
                    "status": 500,
                    "message": "Server error",
                    "error": str(error)
                }),
                content_type='application/json',
                status=500
            )

    @http.route('/api/search', type='json', auth="public", csrf=False, methods=["POST"])
    def search_api_aardwolf(self):
        keyword = request.jsonrequest.get("search")
        _logger.info("Received keyword: %s", keyword)

        products = request.env['product.template'].sudo().search([
            ('name', 'ilike', keyword)
        ], limit=10)

        return [
            {
                'name': p.name,
                'image_url': f"/web/image/product.template/{p.id}/image_128",
                'url': p.website_url,
            }
            for p in products
        ]

    @http.route('/custom/cart/add', type='http', auth='public', website=True, csrf=False)
    def add_to_cart(self, product_id, quantity=1, **kwargs):
        user = request.env.user
        if user and not user._is_public():
            sale_order = request.website.sale_get_order(force_create=True)
            product = request.env['product.product'].browse(int(product_id))
            if product.exists():
                sale_order._cart_update(
                    product_id=product.id,
                    add_qty=int(quantity),
                    set_qty=0
                )

                return Response(json.dumps({'status': 'ok', 'message': 'Đã thêm vào giỏ hàng'}),
                                content_type='application/json')
            else:
                return Response(json.dumps({'status': 'error', 'message': 'Không tìm thấy sản phẩm'}),
                                content_type='application/json')
        else:
            return Response(json.dumps({'status': 'client', 'message': 'Lưu vào localStorage'}),
                            content_type='application/json')
