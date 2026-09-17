document.querySelector('.footer_top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});
