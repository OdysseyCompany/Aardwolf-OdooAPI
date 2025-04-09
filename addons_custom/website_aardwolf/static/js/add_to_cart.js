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
