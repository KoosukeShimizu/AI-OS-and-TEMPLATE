document.addEventListener('DOMContentLoaded', () => {
  const lightboxTargets = document.querySelectorAll('[data-lightbox]');
  
  if (lightboxTargets.length === 0) return;

  const html = document.documentElement; // ← 追加

  const lightboxOverlay = document.createElement('div');
  lightboxOverlay.classList.add('c-lightbox-overlay');
  lightboxOverlay.innerHTML = `
    <div class="c-lightbox-inner">
      <img src="" alt="">
      <button class="c-lightbox-close">&times;</button>
    </div>
  `;
  document.body.appendChild(lightboxOverlay);

  const lightboxImg = lightboxOverlay.querySelector('img');
  const closeBtn = lightboxOverlay.querySelector('.c-lightbox-close');

  lightboxTargets.forEach(target => {
    target.addEventListener('click', () => {
      lightboxImg.src = target.getAttribute('src');
      lightboxImg.alt = target.getAttribute('alt') || '';
      lightboxOverlay.classList.add('is-active');
      html.classList.add('is-scroll-off'); // ← スクロール停止
    });
  });

  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay || e.target === closeBtn) {
      lightboxOverlay.classList.remove('is-active');
      html.classList.remove('is-scroll-off'); // ← スクロール解除
    }
  });
});