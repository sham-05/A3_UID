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
    if (!container) return;

    // Empty cart state
    if (cart.length === 0) {
        container.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
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
