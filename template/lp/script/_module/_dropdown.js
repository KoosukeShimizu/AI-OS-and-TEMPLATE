document.addEventListener('DOMContentLoaded', () => {
  const triggers = document.querySelectorAll('[data-dropdown-trigger]');

  triggers.forEach(trigger => {
    const target = trigger.nextElementSibling;
    if (!target || !target.hasAttribute('data-dropdown-target')) return;

    trigger.addEventListener('click', () => {
      trigger.classList.toggle('is-open');
      const isHidden = target.hasAttribute('hidden');
      if (isHidden) {
        target.removeAttribute('hidden');
      } else {
        target.setAttribute('hidden', '');
      }
    });
  });
});