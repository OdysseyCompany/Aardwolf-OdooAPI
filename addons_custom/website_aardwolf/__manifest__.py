{
    'name': 'Website Aardwolf',
    'version': '1.0',
    'category': 'Website',
    'summary': '',
    'author': '',
    'website': '',
    'depends': ['website_sale', 'portal', 'api_product'],
    'data': [
        'data/mail_template_data.xml',
        'views/website_templates.xml',
        'views/website_templates_categories.xml',
        'views/website_templates_product.xml',
        'views/shop_cart_template.xml',
        'views/login_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'website_aardwolf/static/src/js/custom_variant_mixin.js',
            'website_aardwolf/static/src/js/my_custom_product.js',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'translations': [],
}