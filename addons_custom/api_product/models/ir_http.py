# Part of Odoo. See LICENSE file for full copyright and licensing details.
import logging
import os

from odoo.addons.base.models.ir_http import EXTENSION_TO_WEB_MIMETYPES
from odoo.http import request

from odoo import models

logger = logging.getLogger(__name__)


class IrHttp(models.AbstractModel):
    _inherit = 'ir.http'

    @classmethod
    def _serve_page(cls):
        req_page = request.httprequest.path

        def _search_page(comparator='='):
            page_domain = [('url', comparator, req_page)] + request.website.website_domain()
            return request.env['website.page'].sudo().search(page_domain, order='website_id asc', limit=1)

        # specific page first
        page = _search_page()
        featured_product = request.env['product.group'].sudo().search([('is_featured', '=', True)], limit=1)
        trend_in_industry = request.env['product.group'].sudo().search([('is_industry', '=', True)], limit=1)
        # case insensitive search
        if not page:
            page = _search_page('=ilike')
            if page:
                logger.info("Page %r not found, redirecting to existing page %r", req_page, page.url)
                return request.redirect(page.url)

        # redirect without trailing /
        if not page and req_page != "/" and req_page.endswith("/"):
            # mimick `_postprocess_args()` redirect
            path = request.httprequest.path[:-1]
            if request.lang != cls._get_default_lang():
                path = '/' + request.lang.url_code + path
            if request.httprequest.query_string:
                path += '?' + request.httprequest.query_string.decode('utf-8')
            return request.redirect(path, code=301)

        if (
                page
                and (request.env.user.has_group('website.group_website_designer') or page.is_visible)
                and (
                # If a generic page (niche case) has been COWed and that COWed
                # page received a URL change, it should not let you access the
                # generic page anymore, despite having a different URL.
                page.website_id
                or not page.view_id._get_specific_views().filtered(lambda view: view.website_id == request.website)
        )
        ):
            _, ext = os.path.splitext(req_page)
            response = request.render(page.view_id.id, {
                'main_object': page,
                'featured_product': featured_product.product_template_ids if featured_product else False,
                'trend_in_industry': trend_in_industry.product_template_ids if trend_in_industry else False,
            }, mimetype=EXTENSION_TO_WEB_MIMETYPES.get(ext, 'text/html'))
            return response
        return False
