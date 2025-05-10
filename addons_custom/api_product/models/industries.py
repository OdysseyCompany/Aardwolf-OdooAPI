from odoo import fields, models, api
from slugify import slugify


class ProductIndustries(models.Model):
    _name = 'product.industries'

    name = fields.Char('name')
    slug = fields.Char('Slug', store=True, compute='related_slug_by_name')
    image_1920 = fields.Binary('Image_1920')
    description = fields.Char('Description')
    product_template_ids = fields.Many2many('product.template', string='Product')

    @api.depends('name')
    def related_slug_by_name(self):
        for record in self:
            record.slug = slugify(record.display_name)
