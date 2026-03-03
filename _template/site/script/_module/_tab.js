document.querySelectorAll('[data-tab-group]').forEach(group => {
  const triggers = group.querySelectorAll('[data-tab-trigger]');
  const contents = group.querySelectorAll('[data-tab-content]');

  triggers.forEach((trigger, idx) => {
    trigger.addEventListener('click', () => {
      triggers.forEach(t => t.classList.remove('is-active'));
      trigger.classList.add('is-active');

      contents.forEach((content, contentIdx) => {
        content.classList.toggle('is-active', contentIdx === idx);
      });
    });
  });
});