from odoo import fields, models, api, _
from slugify import slugify


class ProductCategory(models.Model):
    _inherit = 'product.category'

    slug = fields.Char('Slug', store=True, compute='related_slug_by_name')

    @api.depends('name')
    def related_slug_by_name(self):
        for record in self:
            record.slug = slugify(record.name)


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    slug = fields.Char('Slug', store=True, compute='related_slug_by_name')

    @api.depends('name')
    def related_slug_by_name(self):
        for record in self:
            record.slug = slugify(record.name)
