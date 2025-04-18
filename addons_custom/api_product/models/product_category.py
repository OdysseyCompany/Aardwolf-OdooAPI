from slugify import slugify
import base64
import logging
from io import BytesIO

from PIL import Image

from odoo import models, fields, api

_logger = logging.getLogger(__name__)


class ProductCategory(models.Model):
    _inherit = 'product.category'

    slug = fields.Char('Slug', store=True, compute='related_slug_by_name')
    image_1920 = fields.Binary('Image_1920')
    description = fields.Char('Description')

    @api.depends('name')
    def related_slug_by_name(self):
        for record in self:
            record.slug = slugify(record.display_name)

class ProductGroup(models.Model):
    _name = 'product.group'

    name = fields.Char('Name')
    product_template_ids = fields.Many2many('product.template', string='Product')
    is_featured = fields.Boolean('Featured product')
    is_industry = fields.Boolean('Industry product')

class ProductTemplate(models.Model):
    _inherit = 'product.template'

    slug = fields.Char('Slug', store=True, compute='related_slug_by_name')
    image_thumb = fields.Binary("Thumbnail", attachment=True)
    image_ids = fields.One2many('image.product', 'product_template_id', string='Image')
    video_url = fields.Char('Video URL')

    @api.model_create_multi
    def create(self, vals_list):
        # Khi tạo mới sản phẩm, tạo thumbnail nếu có image_1920
        for vals in vals_list:
            if vals.get('image_1920'):
                vals['image_thumb'] = self._generate_thumbnail(vals['image_1920'])
        return super().create(vals_list)

    def write(self, vals):
        # Khi cập nhật ảnh gốc, cũng cập nhật thumbnail
        if vals.get('image_1920'):
            vals['image_thumb'] = self._generate_thumbnail(vals['image_1920'])
        return super().write(vals)

    def _generate_thumbnail(self, image_base64):
        try:
            image_data = base64.b64decode(image_base64)
            image = Image.open(BytesIO(image_data))

            # Chuyển ảnh thành RGB và tạo thumbnail
            image = image.convert("RGB")
            image.thumbnail((64, 64), Image.ANTIALIAS)

            buffer = BytesIO()
            image.save(buffer, format='JPEG', quality=70)  # Nén ảnh thành JPEG với chất lượng 70
            return base64.b64encode(buffer.getvalue())
        except Exception as e:
            _logger.warning("Thumbnail generation failed: %s", e)
            return False

    @api.depends('name')
    def related_slug_by_name(self):
        for record in self:
            record.slug = slugify(record.name)

class ImageProduct(models.Model):
    _name = 'image.product'

    name = fields.Char('Name', size=100, required=True)
    image = fields.Binary('Image')
    product_template_id = fields.Many2one('product.template')
    description = fields.Text('Description', size=600)