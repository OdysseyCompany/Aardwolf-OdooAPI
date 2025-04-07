{
    'name': 'Website Aardwolf',
    'version': '1.0',
    'category': 'Website',
    'summary': '',
    'author': '',
    'website': '',
    'depends': ['website_sale', 'portal', 'api_product'],
    'data': [
        'views/website_templates.xml',
        'views/website_templates_categories.xml',
        # 'views/website_templates_product.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
            'website_aardwolf/static/src/css/style_home.css',
            'website_aardwolf/static/src/css/style_category.css',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'translations': [],
}