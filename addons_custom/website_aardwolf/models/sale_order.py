from odoo import fields, models, api


class SaleOrder(models.Model):
    _inherit = 'sale.order'

    @api.model_create_multi
    def create(self, vals_list):
        res = super().create(vals_list)
        template = self.env.ref('website_aardwolf.mail_template_new_sale_order')
        template.sudo().send_mail(res.id, force_send=True)
        return res
