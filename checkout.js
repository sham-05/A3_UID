if (document.getElementById('orderId')) {
    const orderId = '2' + Math.floor(Math.random() * 9e13).toString().padStart(13, '0');
    document.getElementById('orderId').textContent = 'Order ID : ' + orderId;

    const now = new Date();
    const fmt = d => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
    const delivery = new Date(now);
    delivery.setDate(delivery.getDate() + 7);
    document.getElementById('orderDate').textContent = 'Order Date : ' + fmt(now);
    document.getElementById('estimatedDelivery').textContent = 'Estimated delivery : ' + fmt(delivery);

    const confirmCart = getCart();
    const itemsEl = document.getElementById('confirmationItems');
    let itemTotal = 0;
    if (confirmCart.length === 0) {
        itemsEl.innerHTML = '<p style="padding:24px 28px;color:#888;font-size:14px;">No items found.</p>';
    } else {
        itemsEl.innerHTML = confirmCart.map(item => {
            const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
            itemTotal += price * Number(item.qty);
            return `
                    <div class="order-item-row">
                        <img class="order-item-thumb" src="${item.image}" alt="${item.name}">
                        <span class="order-item-name">${item.name}</span>
                        <div class="order-item-right">
                            <div class="order-item-price">$${(price * Number(item.qty)).toFixed(2)}</div>
                            <div class="order-item-qty">Qty: ${item.qty}</div>
                        </div>
                    </div>
                `;
        }).join('');
    }

    const shipping = 14;
    const tax = itemTotal * 0.1;
    const total = itemTotal + shipping + tax;
    document.getElementById('costItems').textContent = '$' + itemTotal.toFixed(2);
    document.getElementById('costTax').textContent = '$' + tax.toFixed(2);
    document.getElementById('costTotal').textContent = '$' + total.toFixed(2);
}

function renderOrderItems() {
    const cart = getCart();
    const container = document.getElementById('checkoutItems');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const countEl = document.getElementById('checkoutItemCount');

    if (cart.length === 0) {
        container.innerHTML = '<p class="order-empty">Your cart is empty.</p>';
        subtotalEl.textContent = '$0.00';
        if (countEl) countEl.textContent = '0 Total Items';
        return;
    }

    if (countEl) countEl.textContent = cart.length + ' Total Items';

    let total = 0;
    container.innerHTML = cart.map((item, i) => {
        const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
        total += price * Number(item.qty);
        return `
                    <div class="order-item">
                        <img class="order-item-img" src="${item.image}" alt="${item.name}">
                        <div class="order-item-info">
                            <span class="order-item-name">${item.name}</span>
                            <div class="order-item-controls">
                                <div class="order-qty-pill">
                                    <button onclick="changeOrderQty(${i}, -1)">&#8722;</button>
                                    <span>${item.qty}</span>
                                    <button onclick="changeOrderQty(${i}, 1)">&#43;</button>
                                </div>
                                <button class="order-remove-btn" onclick="removeOrderItem(${i})">
                                    <i class="fa-solid fa-circle-minus"></i>
                                </button>
                            </div>
                            <span class="order-item-price">${item.price}</span>
                        </div>
                    </div>
                `;
    }).join('');

    const shipping = 14;
    const tax = total * 0.1;
    const grandTotal = total + shipping + tax;

    const costItemsEl = document.getElementById('checkoutCostItems');
    const costShippingEl = document.getElementById('checkoutCostShipping');
    const costTaxEl = document.getElementById('checkoutCostTax');
    if (costItemsEl) costItemsEl.textContent = '$' + total.toFixed(2);
    if (costShippingEl) costShippingEl.textContent = '$' + shipping.toFixed(2);
    if (costTaxEl) costTaxEl.textContent = '$' + tax.toFixed(2);
    subtotalEl.textContent = '$' + grandTotal.toFixed(2);
}

function changeOrderQty(index, delta) {
    const cart = getCart();
    const newQty = Number(cart[index].qty) + delta;
    if (newQty < 1) return;
    cart[index].qty = newQty;
    saveCart(cart);
    renderOrderItems();
}

function removeOrderItem(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderOrderItems();
}

if (document.getElementById('checkoutItems')) {
    renderOrderItems();
}

function validateCheckout() {
    const inputs = document.querySelectorAll('.checkout-form .form-input');
    let valid = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('form-input--error');
            valid = false;
        }
    });
    if (valid) window.location.href = '/A3_UID/checkout-payment.html';
}

// Clear error state as soon as the user types in a flagged field
document.querySelectorAll('.checkout-form .form-input').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('form-input--error'));
});
