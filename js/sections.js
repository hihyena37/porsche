const cards = document.querySelectorAll('.featured_card, .discover_card');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal_visible');
        observer.unobserve(entry.target);
      }
    });
  });
  cards.forEach(card => {
    card.classList.add('reveal_pending');
    observer.observe(card);
  });
}
