function openCart() {
    // Add overlay and make left panel visible when called. 
    document.getElementById('cartPanel').classList.add('cart-panel--open');
    document.getElementById('cartOverlay').classList.add('cart-overlay--visible');
    renderCart();
}

function openMenu() {
    // Add overlay and make left panel visible when called. 
    document.getElementById('menuPanel').classList.add('menu-panel--open');
    document.getElementById('menuOverlay').classList.add('menu-overlay--visible');
    renderCart();
}

function closeMenu() {
    document.getElementById('menuPanel').classList.remove('menu-panel--open');
    document.getElementById('menuOverlay').classList.remove('menu-overlay--visible');
}

function closeCart() {
    //Remove overlay and visibility of left panel
    document.getElementById('cartPanel').classList.remove('cart-panel--open');
    document.getElementById('cartOverlay').classList.remove('cart-overlay--visible');
}

function getCart() {
    // get items from cart from local storage (persistent storage)
    // returns a JSON object
    return JSON.parse(localStorage.getItem('cricketHQCart') || '[]');
}

function saveCart(cart) {
    // save items to local storage (persistent storage)
    localStorage.setItem('cricketHQCart', JSON.stringify(cart));
}

function addToCart(name, price, image) {
    const cart = getCart();
    // get quantity from the cart-qty button 
    const cartQty = document.getElementById("cart-qty");
    var num = cartQty.innerHTML;

    // if item already exists in cart, add quantity to existing quantity
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty = Number(existing.qty) + Number(num);
    } else {
        // if not, add new item to cart (JSON)
        cart.push({ name, price, image, qty: num });
    }
    // save new cart to persistent storage
    saveCart(cart);
    // Open the cart when users add items to cart (so they can see what they've added)
    openCart();
}

function removeFromCart(index) {
    const cart = getCart();

    // deletes element from cart items array at index
    cart.splice(index, 1);
    saveCart(cart);

    //re-render cart after deletion
    renderCart();
}

function renderCart() {
    const cart = getCart();
    const container = document.getElementById('cartItems');
    const footer = document.getElementById('cartFooter');
    if (!container) return;

    // Empty cart state
    if (cart.length === 0) {
        container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
        if (footer) footer.style.display = 'none';
        return;
    }

    // this HTML block is rendered for each individual item in the cart
    container.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
            <img class="cart-item-img" src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">${item.price}</span>
                <div class="cart-item-row">
                    <span class="cart-item-qty">Qty: ${item.qty}</span>
                    <button class="cart-item-remove" onclick="removeFromCart(${i})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    if (footer) {
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(String(item.price).replace(/[^0-9.]/g, ''));
            return sum + (price * Number(item.qty));
        }, 0);
        document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
        footer.style.display = 'flex';
    }
}

function reduceQty() {
    const qty = document.getElementById("cart-qty");
    var num = qty.innerHTML;
    if (num > 1) {
        num--;
    }
    qty.innerHTML = num;
}

function increaseQty() {
    const qty = document.getElementById("cart-qty");
    var num = qty.innerHTML;
    num++;
    qty.innerHTML = num;
}

function setActiveMenuLink() {
    const filename = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === filename) {
            link.classList.add('menu-link--active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveMenuLink);

document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.featured-card');
    const grid = document.querySelector('.featured-grid');

    // assert that the grid isw there
    if (!cards.length || !grid) return;

    // alternate cards that slide in left and right
    cards.forEach((card, i) => {
        card.classList.add(i % 2 === 0 ? 'scroll-left' : 'scroll-right');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // trigger animations when scrolled
            if (entry.isIntersecting) {
                cards.forEach(card => card.classList.add('scroll-visible'));
                observer.unobserve(grid);
            }
        });

        // control speed of animation
    }, { threshold: 0.6 });

    observer.observe(grid);
});


// Confirmation page only — guard prevents crash on other pages
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

    subtotalEl.textContent = '$' + total.toFixed(2);
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