import { rpc } from '@web/core/network/rpc';

document.addEventListener('DOMContentLoaded', function () {
    const addToCartBtn = document.querySelector('.btn-add');

    // Định nghĩa object chứa các phương thức
    const cartHandler = {
        _submitForm: function (product_id, quantity) {
            const params = {
                product_id: product_id,
                product_template_id: product_id,
                quantity: quantity,
                product_custom_attribute_values: [],
                variant_values: [],
                no_variant_attribute_values: [],
            };
            params.add_qty = params.quantity;
            params.product_custom_attribute_values = JSON.stringify(params.product_custom_attribute_values);
            params.no_variant_attribute_values = JSON.stringify(params.no_variant_attribute_values);
            delete params.quantity;
            return this.addToCart(params);
        },

        addToCart: function (params) {
            return this._addToCartInPage(params);
        },

        _addToCartInPage: async function (params) {
            const data = await rpc("/shop/cart/update_json", {
                ...params,
                display: false,
                force_create: true,
            });
            if (data.cart_quantity && (data.cart_quantity !== parseInt($(".my_cart_quantity").text()))) {
                updateCartNavBar(data);
            }
            showCartNotification(() => {}, data.notification_info); // chỉnh `.call` => empty callback
            return data;
        }
    };

    function updateCartNavBar(data) {
        sessionStorage.setItem('website_sale_cart_quantity', data.cart_quantity);
        $(".my_cart_quantity").parents('li.o_wsale_my_cart').removeClass('d-none').end()
            .toggleClass('d-none', data.cart_quantity === 0)
            .addClass('o_mycart_zoom_animation').delay(300).queue(function () {
                $(this)
                    .toggleClass('fa fa-warning', !data.cart_quantity)
                    .attr('title', data.warning)
                    .text(data.cart_quantity || '')
                    .removeClass('o_mycart_zoom_animation')
                    .dequeue();
            });

        $(".js_cart_lines").first().before(data['website_sale.cart_lines']).end().remove();
        $("#cart_total").replaceWith(data['website_sale.total']);

        const mainButton = document.querySelector("a[name='website_sale_main_button']");
        if (mainButton) {
            mainButton.classList.toggle('disabled', !data.cart_ready);
        }
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function () {
            const quantity = parseInt(document.querySelector('.quantity')?.textContent || '1');
            const productId = this.dataset.productId;
            cartHandler._submitForm(productId, quantity);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const addToCartBtn = document.querySelector('.btn-add');

    addToCartBtn.addEventListener('click', function () {
        const quantity = parseInt(document.querySelector('.quantity').textContent || '1');
        const productId = this.dataset.productId;

        fetch('/custom/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok') {
                alert('🛒 Đã thêm vào giỏ hàng!');
            } else if (data.status === 'client') {
                // Lưu giỏ hàng vào localStorage nếu chưa login
                let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const existing = cart.find(item => item.product_id == productId);
                if (existing) {
                    existing.quantity += quantity;
                } else {
                    cart.push({ product_id: productId, quantity: quantity });
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                alert('🛍️ Sản phẩm đã lưu tạm trên trình duyệt!');
            } else {
                alert(data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert('⚠️ Lỗi khi thêm vào giỏ hàng');
        });
    });
});
