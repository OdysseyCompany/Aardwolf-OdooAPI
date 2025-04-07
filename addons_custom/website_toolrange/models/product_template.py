import base64
import logging
from io import BytesIO

from PIL import Image

from odoo import models, fields, api

_logger = logging.getLogger(__name__)


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    image_thumb = fields.Binary("Thumbnail", attachment=True)

    @api.model
    def create(self, vals):
        # Khi tạo mới sản phẩm, tạo thumbnail nếu có image_1920
        if vals.get('image_1920'):
            vals['image_thumb'] = self._generate_thumbnail(vals['image_1920'])
        return super().create(vals)

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
