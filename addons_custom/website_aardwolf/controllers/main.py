import json
import logging
import re

import odoo.exceptions
import odoo.modules.registry
import unicodedata
import werkzeug
from markupsafe import Markup
from odoo.exceptions import UserError
from odoo.http import Controller
from odoo.http import request
from odoo.http import route
from odoo.tools.translate import _
from werkzeug.urls import url_encode

from odoo import http
from odoo.addons.auth_signup.models.res_users import SignupError
from odoo.addons.web.controllers.home import Home
from odoo.addons.web.controllers.utils import ensure_db
from odoo.addons.website.controllers.main import QueryURL
from odoo.addons.website_sale.controllers.main import WebsiteSale

_logger = logging.getLogger(__name__)

# Shared parameters for all login/signup flows
SIGN_UP_REQUEST_PARAMS = {'db', 'login', 'debug', 'token', 'message', 'error', 'scope', 'mode',
                          'redirect', 'redirect_hostname', 'email', 'name', 'partner_id',
                          'password', 'confirm_password', 'city', 'country_id', 'lang', 'signup_email',
                          'account_created'}
LOGIN_SUCCESSFUL_PARAMS = set()
CREDENTIAL_PARAMS = ['login', 'password', 'type']

LOGIN_SUCCESSFUL_PARAMS.add('account_created')


def slugify(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    value = re.sub(r'[^\w\s-]', '', value).strip().lower()
    return re.sub(r'[-\s]+', '-', value)


class WebsiteAardwolf(http.Controller):

    @http.route('/contact/form', type='http', auth="public", methods=['POST'], website=True,
                csrf=False)
    def contact_form_empty(self, **kwargs):
        name = kwargs['firstName'] + ' ' + kwargs['lastName']
        partner = request.env['res.partner'].sudo().create({
            'name': name,
            'email': kwargs['email'],
            'phone': kwargs['phone'],
            'zip': kwargs['postcode'],
            'street': kwargs['country'],
            'comment': kwargs,
        })
        if kwargs.get('request_price'):
            mail_template = request.env.ref('website_aardwolf.mail_template_request_price',
                                            raise_if_not_found=False)
        else:
            mail_template = request.env.ref('website_aardwolf.mail_template_contact_form',
                                            raise_if_not_found=False)

        if mail_template:
            mail_template.sudo().send_mail(partner.id, force_send=True)
        return request.render('website_aardwolf.contact_thanks_page')

    def update_product_image_thumb(self):
        # Chạy bằng shell hoặc cron job
        products = request.env['product.template'].sudo().search(
            [('image_1920', '!=', False), ('image_thumb', '=', False)])
        for p in products:
            p.image_thumb = p._generate_thumbnail(p.image_1920)

    @http.route(['/categories'], type='http', auth="public", website=True)
    def categories(self, **post):
        try:
            result = []
            temp = []
            categories = request.env['product.public.category'].sudo().search([('parent_id', '=', False)])

            for idx, categ in enumerate(categories):
                categ_product = request.env['product.template'].sudo().search(
                    [('public_categ_ids', 'child_of', categ.id),
                     ('is_published', '=', True)])  # , ('is_published', '=', True)
                temp.append({
                    'name': categ.name,
                    'description': categ.website_description,
                    'img': f"/web/image?model=product.public.category&id={categ.id}&field=image_1920",
                    'slug': categ.slug,
                    'product': [{
                        'website_url': prd.website_url,
                        'name': prd.name,
                        'img': f"/web/image?model=product.template&id={prd.id}&field=image_256",
                    } for prd in categ_product]
                })

                if len(temp) == 2:
                    result.append(temp)
                    temp = []

            if temp:
                result.append(temp)

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
            category = request.env['product.public.category'].sudo().search([('slug', '=', slug)], limit=1)
            if not category:
                return request.not_found()

            sub_cate = request.env['product.public.category'].sudo().search([('parent_id', '=', category.id)])
            product_tmpl_by_sub = {}
            if sub_cate:
                all_sub_ids = sub_cate.ids
                all_sub_products = request.env['product.template'].sudo().search([
                    ('public_categ_ids', 'child_of', all_sub_ids), ('is_published', '=', True)
                ])
                for sub in sub_cate:
                    product_tmpl_by_sub[sub.id] = []

                for prd in all_sub_products:
                    for cat in prd.public_categ_ids.filtered(lambda c: c.id in all_sub_ids):
                        product_tmpl_by_sub[cat.id].append(prd)

            def clean_product_data(prod):
                return {
                    'name': prod.name,
                    'website_url': prod.website_url,
                    'slug': slugify(prod.name),
                    'list_price': prod.list_price,
                    'image_url': f"/web/image/product.template/{prod.id}/image_1920" if prod.image_1920 else '/website_aardwolf/static/imgs/common/products/product-1.png',
                }

            sub_category = []
            for rec in sub_cate:
                products = [clean_product_data(prd) for prd in product_tmpl_by_sub.get(rec.id, [])]
                sub_category.append({
                    'name': rec.name,
                    'id': rec.id,
                    'products_json': json.dumps(products)
                })

            # Products chính
            products = request.env['product.template'].sudo().search([
                ('public_categ_ids', 'child_of', category.id), ('is_published', '=', True)
            ], limit=int(limit), offset=(int(page) - 1) * limit)
            data = [clean_product_data(prod) for prod in products]

            return request.render("website_aardwolf.categories_detail_templates_aardwolf", {
                'values': data,
                'category_name': category.name,
                'description': category.website_description,
                'category_slug': slugify(category.name),
                'sub_category': sub_category,
            })

        except Exception as e:
            return request.make_response(str(e), status=500)

    @http.route(['/product-detail/<slug>'], type='http', auth="public", website=True)
    def product_detail(self, slug, **post):
        try:
            product = request.env['product.template'].sudo().search([('slug', '=', slug), ('is_published', '=', True)],
                                                                    limit=1)
            if not product:
                return request.not_found()
            url_img = f"/web/image/product.template/{product.id}/image_1024" if product.image_1024 else '/website_aardwolf/static/imgs/common/product/img-1.png'
            result = {
                'category': product.public_categ_ids[0].name if product.public_categ_ids else product.categ_id.name,
                'categ_slug': product.public_categ_ids[0].slug if product.public_categ_ids else product.categ_id.name,
                'name': product.name,
                'description': product.description,
                'key_features': product.description,
                'general': product.description,
                'video': product.video_url,
                'img_128': url_img,
                'id': product.id
            }
            url_image = [str(url_img)]
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
    def get_product(self, limit=15, page=1, search='', categ_id='', industries='', **post):
        try:
            domain = [('is_published', '=', True)]
            if search:
                domain += [('name', 'ilike', search)]
            if categ_id:
                domain += [('public_categ_ids', 'child_of', int(categ_id))]
            if industries:
                domain += [('industries_ids', 'in', int(industries))]
            result = []
            products = request.env['product.template'].sudo().search_read(domain=domain,
                                                                          fields=['name', 'slug', 'image_512',
                                                                                  'website_url'], limit=limit,
                                                                          offset=(int(page) - 1) * limit)

            for prd in products:
                result.append({
                    'name': prd.get('name'),
                    'website_url': prd.get('website_url'),
                    'slug': prd.get('slug'),
                    'img': f"/web/image/product.template/{prd.get('id')}/image_512" if prd.get(
                        'image_512') else '/website_aardwolf/static/imgs/common/product/img-1.png',
                })
            return request.render("website_aardwolf.product_templates_aardwolf", {
                'values': result,
                'search': search
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )

    @http.route(['/contact'], type='http', auth="public", website=True, sitemap=False)
    def contact(self, **post):
        try:
            result = []
            return request.render("website_aardwolf.contact_aardwolf", {
                'values': result
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )

    @http.route(['/careers'], type='http', auth="public", website=True, sitemap=False)
    def careers(self, **post):
        try:
            result = []
            return request.render("website_aardwolf.careers_aardwolf", {
                'values': result
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )

    @http.route(['/our-business'], type='http', auth="public", website=True, sitemap=False)
    def our_business(self, **post):
        try:
            result = []
            return request.render("website_aardwolf.our_business_aardwolf", {
                'values': result
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )

    @http.route(['/our-distributor'], type='http', auth="public", website=True, sitemap=False)
    def our_distributor(self, **post):
        try:
            result = []
            return request.render("website_aardwolf.our_distributor_aardwolf", {
                'values': result
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )

    @http.route(['/our-trade-shows'], type='http', auth="public", website=True, sitemap=False)
    def our_trade_shows(self, **post):
        try:
            result = []
            return request.render("website_aardwolf.our_trade_shows_aardwolf", {
                'values': result
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )

    # @http.route('/cart', type='http', auth='public', website=True)
    # def view_cart(self, **kwargs):
    #     sale_order = request.website.sale_get_order()
    #     order_lines = sale_order.order_line if sale_order else []
    #
    #     return request.render('your_module_name.cart_template', {
    #         'order': sale_order,
    #         'order_lines': order_lines,
    #     })

    @http.route('/become-distributor', type='http', auth='public', website=True)
    def become_distributor(self, **kwargs):
        try:
            result = []
            return request.render("website_aardwolf.become_distributor_aardwolf", {
                'values': result
            })

        except Exception as error:
            return request.make_response(
                str(error),
                headers=[('Content-Type', 'text/plain')],
                status=500
            )


class AardwolfHome(Home):

    def _login_redirect(self, uid, redirect=None):
        """ Redirect regular users (employees) to the backend) and others to
        the frontend
        """
        if not redirect and request.params.get('login_success'):
            if request.env['res.users'].browse(uid)._is_internal():
                redirect = '/odoo?' + request.httprequest.query_string.decode()
            else:
                redirect = '/'
        return super()._login_redirect(uid, redirect=redirect)

    @http.route('/web/login', type='http', auth='none', readonly=False)
    def web_login(self, redirect=None, **kw):
        ensure_db()
        request.params['login_success'] = False
        if request.httprequest.method == 'GET' and redirect and request.session.uid:
            return request.redirect(redirect)

        # simulate hybrid auth=user/auth=public, despite using auth=none to be able
        # to redirect users when no db is selected - cfr ensure_db()
        if request.env.uid is None:
            if request.session.uid is None:
                # no user -> auth=public with specific website public user
                request.env["ir.http"]._auth_method_public()
            else:
                # auth=user
                request.update_env(user=request.session.uid)

        values = {k: v for k, v in request.params.items() if k in SIGN_UP_REQUEST_PARAMS}
        try:
            values['databases'] = http.db_list()
        except odoo.exceptions.AccessDenied:
            values['databases'] = None

        if request.httprequest.method == 'POST':
            try:
                credential = {key: value for key, value in request.params.items() if key in CREDENTIAL_PARAMS and value}
                credential.setdefault('type', 'password')
                auth_info = request.session.authenticate(request.db, credential)
                request.params['login_success'] = True
                return request.redirect(self._login_redirect(auth_info['uid'], redirect=redirect))
            except odoo.exceptions.AccessDenied as e:
                if e.args == odoo.exceptions.AccessDenied().args:
                    values['error'] = _("Wrong login/password")
                else:
                    values['error'] = e.args[0]
        else:
            if 'error' in request.params and request.params.get('error') == 'access':
                values['error'] = _('Only employees can access this database. Please contact the administrator.')

        if 'login' not in values and request.session.get('auth_login'):
            values['login'] = request.session.get('auth_login')

        if not odoo.tools.config['list_db']:
            values['disable_database_manager'] = True

        response = request.render('website_aardwolf.left_login_template', values)
        response.headers['Cache-Control'] = 'no-cache'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['Content-Security-Policy'] = "frame-ancestors 'self'"
        return response

    @http.route('/web/signup', type='http', auth='public', website=True, sitemap=False)
    def web_auth_signup(self, *args, **kw):
        qcontext = self.get_auth_signup_qcontext()

        if not qcontext.get('token') and not qcontext.get('signup_enabled'):
            raise werkzeug.exceptions.NotFound()

        if 'error' not in qcontext and request.httprequest.method == 'POST':
            try:
                if not request.env['ir.http']._verify_request_recaptcha_token('signup'):
                    raise UserError(_("Suspicious activity detected by Google reCaptcha."))
                partner = False
                if kw:
                    partner = request.env['res.partner'].sudo().create({
                        'name': kw['first_name'] + ' ' + kw['last_name'],
                        'email': kw['login'],
                        'phone': kw['phone'],
                        'company_name': kw['company_name'],
                        'zip': kw['postcode'],
                        'street': kw['country'],
                        'comment': kw['message'],
                    })
                # Check if the email is already registered
                # self.do_signup(qcontext)

                # Set user to public if they were not signed in by do_signup
                # (mfa enabled)
                if request.session.uid is None:
                    public_user = request.env.ref('base.public_user')
                    request.update_env(user=public_user)

                # Send an account creation confirmation email
                User = request.env['res.users']
                # user_sudo = User.sudo().search(
                #     User._get_login_domain(qcontext.get('login')), order=User._get_login_order(), limit=1
                # )
                template = request.env.ref('website_aardwolf.mail_template_noti_user_signup_account_created',
                                           raise_if_not_found=False)
                if partner and template:
                    template.sudo().send_mail(partner.id, force_send=True)
                return request.redirect('/')
            except UserError as e:
                qcontext['error'] = e.args[0]
            except (SignupError, AssertionError) as e:
                if request.env["res.users"].sudo().search_count([("login", "=", qcontext.get("login"))], limit=1):
                    qcontext["error"] = _("Another user is already registered using this email address.")
                else:
                    _logger.warning("%s", e)
                    qcontext['error'] = _("Could not create a new account.") + Markup('<br/>') + str(e)

        elif 'signup_email' in qcontext:
            user = request.env['res.users'].sudo().search(
                [('email', '=', qcontext.get('signup_email')), ('state', '!=', 'new')], limit=1)
            if user:
                return request.redirect('/web/login?%s' % url_encode({'login': user.login, 'redirect': '/web'}))

        response = request.render('website_aardwolf.signup_aardwolf', qcontext)
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['Content-Security-Policy'] = "frame-ancestors 'self'"
        return response

    @http.route([
        '/website/search',
        '/website/search/page/<int:page>',
        '/website/search/<string:search_type>',
        '/website/search/<string:search_type>/page/<int:page>',
    ], type='http', auth="public", website=True, sitemap=False, readonly=True)
    def hybrid_list(self, page=1, search='', search_type='all', **kw):
        if not search:
            return request.redirect(f'/product')
        return request.redirect(f'/product?search={search}&page={page}')


class WebsiteSaleAardwolf(WebsiteSale):

    def _prepare_product_values(self, product, category, search, **kwargs):
        ProductCategory = request.env['product.public.category'].sudo()
        if category:
            category = ProductCategory.browse(int(category)).exists()
        keep = QueryURL(
            '/shop',
            **self._product_get_query_url_kwargs(
                category=category and category.id,
                search=search,
                **kwargs,
            ),
        )

        # Needed to trigger the recently viewed product rpc
        view_track = request.website.viewref("website_sale.product").track
        if not product:
            return request.not_found()
        url_img = f"/web/image/product.template/{product.id}/image_1024" if product.image_1024 else '/website_aardwolf/static/imgs/common/product/img-1.png'
        result = {
            'category': product.public_categ_ids[0].name if product.public_categ_ids else False,
            'categ_slug': product.public_categ_ids[0].slug if product.public_categ_ids else False,
            'name': product.name,
            'description': product.description_ecommerce,
            'key_features': product.description_ecommerce,
            'general': product.description_ecommerce,
            'recommended': product.alternative_product_ids,
            'video': product.video_url,
            'img_128': url_img,
            'id': product.id
        }
        url_image = [str(url_img)]
        for img in product.image_ids:
            image_url = f"/web/image/image.product/{img.id}/image" if img.image else '/website_aardwolf/static/imgs/common/product/img-1.png'
            url_image.append(image_url)
        product_variant = []
        for prd in product.product_variant_ids:
            product_variant.append(prd)

        result['product_variant'] = product_variant
        result['image'] = url_image

        return {
            'search': search,
            'category': category,
            'keep': keep,
            'categories': ProductCategory.search([('parent_id', '=', False)]),
            'main_object': product,
            'optional_product_ids': [
                p.with_context(active_id=p.id) for p in product.optional_product_ids
            ],
            'product': product,
            'view_track': view_track,
            'values': result
        }

    @route(['/shop/<model("product.template"):product>'], type='http', auth="public", website=True,
           sitemap=WebsiteSale.sitemap_products, readonly=True)
    def product(self, product, category='', search='', **kwargs):
        if not request.website.has_ecommerce_access():
            return request.redirect('/web/login')

        return request.render("website_aardwolf.product_detail_aardwolf",
                              self._prepare_product_values(product, category, search, **kwargs))

    @route(['/shop/confirm_order'], type='http', auth="public", website=True, sitemap=False)
    def shop_confirm_order(self, **post):
        # name = post['firstName'] + ' ' + post['lastName']
        # partner = request.env['res.partner'].sudo().create({
        #     'name': name,
        #     'email': post['email'],
        #     'phone': post['phone'],
        #     'zip': post['postcode'],
        #     'street': post['country'],
        #     'comment': post,
        # })
        # mail_template = request.env.ref('website_aardwolf.mail_template_request_price',
        #                                 raise_if_not_found=False)
        # if mail_template:
        #     mail_template.sudo().send_mail(partner.id, force_send=True)
        return request.render('website_aardwolf.contact_thanks_page')


class WebsiteSaleVariantController(Controller):

    @route('/website_sale/get_combination_info', type='json', auth='public', methods=['POST'], website=True)
    def get_combination_info_website(
            self, product_template_id, product_id, combination, add_qty, parent_combination=None,
            **kwargs
    ):
        product_template = request.env['product.template'].browse(
            product_template_id and int(product_template_id))

        combination_info = product_template._get_combination_info(
            combination=request.env['product.template.attribute.value'].browse(combination),
            product_id=product_id and int(product_id),
            add_qty=add_qty and float(add_qty) or 1.0,
            parent_combination=request.env['product.template.attribute.value'].browse(parent_combination),
        )

        # Pop data only computed to ease server-side computations.
        for key in ('product_taxes', 'taxes', 'currency', 'date', 'combination'):
            combination_info.pop(key)

        if request.website.product_page_image_width != 'none' and not request.env.context.get('website_sale_no_images',
                                                                                              False):
            combination_info['carousel'] = request.env['ir.ui.view']._render_template(
                'website_sale.shop_product_images',
                values={
                    'product': product_template,
                    'product_variant': request.env['product.product'].browse(combination_info['product_id']),
                    'website': request.env['website'].get_current_website(),
                },
            )

        product = request.env['product.product'].browse(combination_info['product_id'])
        if product and request.website.is_view_active('website_sale.product_tags'):
            combination_info['product_tags'] = request.env['ir.ui.view']._render_template(
                'website_sale.product_tags', values={
                    'all_product_tags': product.all_product_tag_ids.filtered('visible_on_ecommerce')
                }
            )
            combination_info['specifications'] = product.description
        return combination_info
