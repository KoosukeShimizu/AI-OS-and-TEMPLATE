document.addEventListener('DOMContentLoaded', () => {
  const floatbox = document.querySelector('[data-floatbox]');
  if (!floatbox) return;

  let scrollTimer;

  window.addEventListener('scroll', () => {
    floatbox.classList.add('is-hidden');

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      floatbox.classList.remove('is-hidden');
    }, 300); // 停止後300msで再表示
  });
});