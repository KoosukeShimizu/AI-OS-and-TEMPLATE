// ============================================
// パスワード表示切替トグル
// ============================================
document.querySelectorAll('[data-password-toggle]').forEach((toggleBtn) => {
  toggleBtn.addEventListener('click', () => {
    const wrapper = toggleBtn.closest('.c-form__body');
    if (!wrapper) return;

    const input = wrapper.querySelector('[data-password-input]');
    if (!input) return;

    const isVisible = input.type === 'text';
    input.type = isVisible ? 'password' : 'text';
    toggleBtn.classList.toggle('is-view', !isVisible);
  });
});