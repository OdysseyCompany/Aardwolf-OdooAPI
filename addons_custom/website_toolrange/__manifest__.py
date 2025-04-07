# -*- coding: utf-8 -*-
{
    'name': 'Website Toolrange',
    'version': '17.0.1.0.0',
    'category': 'Theme/Creative',
    'summary': 'Theme The Chef is a popular attractive and unique '
               'front end theme for your restaurant website.',
    'description': 'Design Web Pages with Theme The Chef',
    'author': 'Cybrosys Techno Solutions',
    'company': 'Cybrosys Techno Solutions',
    'maintainer': 'Cybrosys Techno Solutions',
    'website': "https://www.cybrosys.com",
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
    'images': [
        'static/description/banner.jpg',
        'static/description/theme_screenshot.jpg',
    ],
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,
    'application': False,
}
