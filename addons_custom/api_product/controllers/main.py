import logging
from odoo import http
from odoo.http import request
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


