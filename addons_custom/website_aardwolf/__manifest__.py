{
    'name': 'Website Toolrange',
    'version': '18.0.1.0.0',
    'category': 'Website',
    'summary': '',
    'description': '',
    'author': '',
    'company': '',
    'maintainer': '',
    'website': "",
    'depends': ['website_sale', 'portal', 'api_product'],
    'data': [
        'views/website_templates.xml',
        'views/website_templates_categories.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            # 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
            'website_toolrange/static/css/style_home.css',
            'website_toolrange/static/css/style_category.css',
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
