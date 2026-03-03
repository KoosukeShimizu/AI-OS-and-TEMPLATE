document.querySelectorAll('[data-accordion-trigger]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.c-accordion__item');
    const content = item.querySelector('[data-accordion-content]');
    const isOpen = item.classList.toggle('is-open');

    // 初期化
    content.style.overflow = 'hidden';

    if (isOpen) {
      // 開く処理
      content.style.display = 'block';
      const height = content.scrollHeight + 'px';
      content.style.height = '0px';

      // 強制 reflow
      void content.offsetHeight;

      content.style.transition = 'height 0.3s ease';
      content.style.height = height;

      content.addEventListener('transitionend', function handler() {
        content.style.height = 'auto';
        content.style.overflow = '';
        content.style.transition = '';
        content.removeEventListener('transitionend', handler);
      });
    } else {
      // 閉じる処理
      const height = content.scrollHeight + 'px';
      content.style.height = height;

      // 強制 reflow
      void content.offsetHeight;

      content.style.transition = 'height 0.3s ease';
      content.style.height = '0px';

      content.addEventListener('transitionend', function handler() {
        content.style.display = 'none';
        content.style.height = '';
        content.style.transition = '';
        content.style.overflow = '';
        content.removeEventListener('transitionend', handler);
      });
    }
  });
});