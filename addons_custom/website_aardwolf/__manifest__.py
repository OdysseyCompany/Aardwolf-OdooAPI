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
        'views/website_templates_product.xml',
        'views/login_templates.xml',
    ],
    'assets': {
        'web.assets_frontend': [
        ],
    },
    'installable': True,
    'application': True,
    'auto_install': False,
    'translations': [],
}