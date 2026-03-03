document.addEventListener('DOMContentLoaded', () => {
  const agreeCheckbox = document.querySelector('[data-agree-trigger]');
  const submitButton = document.querySelector('[data-agree-target]');

  if (!agreeCheckbox || !submitButton) return;

  const toggleSubmit = () => {
    submitButton.disabled = !agreeCheckbox.checked;
  };

  // 初期状態を反映
  toggleSubmit();

  // 状態が変わったときに反映
  agreeCheckbox.addEventListener('change', toggleSubmit);
});