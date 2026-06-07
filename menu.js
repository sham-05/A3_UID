function openMenu() {
    document.getElementById('menuPanel').classList.add('menu-panel--open');
    document.getElementById('menuOverlay').classList.add('menu-overlay--visible');
    renderCart();
}

function closeMenu() {
    document.getElementById('menuPanel').classList.remove('menu-panel--open');
    document.getElementById('menuOverlay').classList.remove('menu-overlay--visible');
}

function setActiveMenuLink() {
    const filename = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.menu-link').forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === filename) {
            link.classList.add('menu-link--active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveMenuLink);
