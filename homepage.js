document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.featured-card');
    const grid = document.querySelector('.featured-grid');

    if (!cards.length || !grid) return;

    // Cards alternate scrroll direction
    cards.forEach((card, i) => {
        card.classList.add(i % 2 === 0 ? 'scroll-left' : 'scroll-right');
    });



    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When element has crossed the threshold
            if (entry.isIntersecting) {
                // Trigger the CSS transition on every card
                cards.forEach(card => card.classList.add('scroll-visible'));
                // Animation only needs to play once
                observer.unobserve(grid);
            }
        });

        // function fires when 60% of the grid is visible
    }, { threshold: 0.6 });

    observer.observe(grid);
});
