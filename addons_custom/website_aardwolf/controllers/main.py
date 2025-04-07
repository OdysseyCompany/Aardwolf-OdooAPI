import re

import unicodedata
from odoo.http import request

from odoo import http


def slugify(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value).strip().lower()
    return re.sub(r'[-\s]+', '-', value)


class WebsiteAardwolf(http.Controller):

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
                fields=['name', 'list_price', 'categ_id', 'image_128']
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
                    image_url = f"{base_url}/web/image/product.template/{prod.get('id')}/image_128" if prod.get(
                        'image_128') else None

                    result[category_name]['products'].append({
                        "name": prod['name'],
                        "slug": slugify(prod['name']),
                        "list_price": prod['list_price'],
                        "image_url": image_url
                    })

            return request.render("website_aardwolf.categories_templates_aardwolf", {
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
                'image_url': f"/web/image/product.template/{prod.id}/image_thumb" if prod.image_thumb else '/website_aardwolf/static/imgs/common/products/product-1.png',
            } for prod in products]

            # Render view với dữ liệu danh mục và sản phẩm
            return request.render("website_aardwolf.categories_detail_templates_aardwolf", {
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
            return request.render("website_aardwolf.categories_templates", {
                'values': result
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )

    @http.route(['/product-detail/<slug>'], type='http', auth="public", website=True)
    def product_detail(self, slug, **post):
        try:
            product = request.env['product.template'].sudo().search([('slug', '=', slug)], limit=1)
            if not product:
                return request.not_found()
            result = {
                'category': product.categ_id.name,
                'categ_slug': product.categ_id.slug,
                'name': product.name,
                'description': product.description,
                'key_features': product.description,
                'general': product.description,
                'video': product.video_url,
                'img_128': f"/web/image/product.template/{product.id}/image_1024" if product.image_1024 else '/website_aardwolf/static/imgs/common/product/img-1.png',
            }
            url_image = []
            for img in product.image_ids:
                image_url = f"/web/image/image.product/{img.id}/image" if img.image else '/website_aardwolf/static/imgs/common/product/img-1.png'
                url_image.append(image_url)
            product_variant = []
            for prd in product.product_variant_ids:
                product_variant.append(prd.display_name)

            result['product_variant'] = product_variant
            result['image'] = url_image
            return request.render("website_aardwolf.product_detail_templates_aardwolf", {
                'values': result,
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )

    @http.route(['/product'], type='http', auth="public", website=True, sitemap=False)
    def get_product(self, limit=15, page=1, **post):
        try:
            result = []
            products = request.env['product.template'].sudo().search_read(
                fields=['name', 'slug', 'image_512'], limit=limit, offset=(int(page) - 1) * limit)

            for prd in products:
                result.append({
                    'name': prd.get('name'),
                    'slug': prd.get('slug'),
                    'img': f"/web/image/product.template/{prd.get('id')}/image_512" if prd.get(
                        'image_512') else '/website_aardwolf/static/imgs/common/product/img-1.png',
                })
            return request.render("website_aardwolf.product_templates_aardwolf", {
                'values': result
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )
