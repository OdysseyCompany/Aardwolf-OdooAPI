from odoo import fields, models, api


class ProductProduct(models.Model):
    _inherit = 'product.product'

    specifications = fields.Html(string='Specifications')
