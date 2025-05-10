# Copyright 2024 Wokwy - quochuy.software@gmail.com
{
    'name': 'API Website',
    'version': '1.0',
    'category': 'Website',
    'summary': '',
    'author': '',
    'website': '',
    'depends': ['jwt_provider', 'website', 'website_sale'],
    'data': [
        'security/ir.model.access.csv',
        'views/product_template_view.xml',
        'views/product_group_view.xml',
        'views/product_industries_view.xml',
    ],
    'assets': {
        },
    'installable': True,
    'application': True,
    'auto_install': False,
    'translations': [],
}