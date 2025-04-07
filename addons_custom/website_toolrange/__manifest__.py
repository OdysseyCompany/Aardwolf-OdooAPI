# Copyright 2024 Wokwy - quochuy.software@gmail.com
{
    'name': 'Website Toolrange',
    'version': '1.0',
    'category': 'Website',
    'summary': '',
    'author': '',
    'website': '',
    'depends': ['website_sale', 'portal', 'api_product'],
    'data': [
        'views/website_templates.xml',
        'views/website_templates_categories.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
            'website_toolrange/static/src/css/style_home.css',
            'website_toolrange/static/src/css/style_category.css',
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'translations': [],
}