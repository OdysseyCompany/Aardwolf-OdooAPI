import re

import unicodedata
from odoo.http import request

from odoo import http


def slugify(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value).strip().lower()
    return re.sub(r'[-\s]+', '-', value)


class WebsiteToolrange(http.Controller):

    def update_product_image_thumb(self):
        # Chạy bằng shell hoặc cron job
        products = request.env['product.template'].search([('image_1920', '!=', False), ('image_thumb', '=', False)])
        for p in products:
            p.image_thumb = p._generate_thumbnail(p.image_1920)

    @http.route(['/categories'], type='http', auth="public", website=True)
    def categories(self, **post):
        try:
            result = {}
            limit_per_category = 6

            base_url = request.env['ir.config_parameter'].sudo().get_param('web.base.url')

            products = request.env['product.template'].sudo().search_read(
                fields=['name', 'list_price', 'categ_id', 'image_128', 'image_thumb']
            )

            for prod in products:
                category_name = prod.get('categ_id', [0, "No Category"])[1]
                category_slug = slugify(category_name)

                if category_name not in result:
                    result[category_name] = {
                        'slug': category_slug,
                        'products': []
                    }

                if len(result[category_name]['products']) < limit_per_category:
                    image_url = f"{base_url}/web/image/product.template/{prod.get('id')}/image_thumb" if prod.get(
                        'image_thumb') else None

                    result[category_name]['products'].append({
                        "name": prod['name'],
                        "slug": slugify(prod['name']),
                        "list_price": prod['list_price'],
                        "image_url": image_url
                    })

            return request.render("website_toolrange.categories_templates", {
                'values': result
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )

    @http.route(['/category-detail/<slug>'], type='http', auth="public", website=True)
    def category_detail(self, slug, limit=9, page=1, **post):
        try:
            # Tìm danh mục với slug từ URL
            category = request.env['product.category'].sudo().search([('slug', '=', slug)], limit=1)

            if not category:
                return request.not_found()
            total_product = request.env['product.template'].sudo().search_count([('categ_id', '=', category.id)])
            # Lấy các sản phẩm thuộc danh mục này, giới hạn 6 sản phẩm và phân trang
            products = request.env['product.template'].sudo().search([
                ('categ_id', '=', category.id)
            ], limit=int(limit), offset=(int(page) - 1) * limit)

            # Tạo dữ liệu để render view
            data = [{
                'name': prod.name,
                'slug': slugify(prod.name),
                'list_price': prod.list_price,
                'image_url': f"/web/image/product.template/{prod.id}/image_thumb" if prod.image_thumb else '/website_toolrange/static/imgs/common/products/product-1.png',
            } for prod in products]

            # Render view với dữ liệu danh mục và sản phẩm
            return request.render("website_toolrange.categories_detail_templates", {
                'values': data,
                'category_name': category.name,
                'category_slug': slugify(category.name),
                'total_product': total_product,
            })

        except Exception as e:
            return request.make_response(str(e), status=500)

    @http.route(['/product'], type='http', auth="public", website=True)
    def product(self, **post):
        try:
            result = {}
            return request.render("website_toolrange.categories_templates", {
                'values': result
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )

    @http.route(['/product-detail'], type='http', auth="public", website=True)
    def product_detail(self, **post):
        try:
            result = {}
            return request.render("website_toolrange.categories_templates", {
                'values': result
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )
