document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('[data-auth]');
  const submitBtn = document.querySelector('button[type="submit"]');
  const timerEl = document.querySelector('[data-timer]');

  // 入力イベント設定
  inputs.forEach((input, index) => {
    input.addEventListener('input', e => {
      const val = e.target.value;

      // 入力値が1桁の数字以外ならクリア
      if (!/^[0-9]$/.test(val)) {
        e.target.value = '';
        return;
      }

      // 次のinputへ自動フォーカス
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      }

      validate();
    });

    // バックスペースで前に戻る
    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });

  // 6桁入力チェック
  function validate() {
    const isFilled = Array.from(inputs).every(input => input.value.length === 1);
    submitBtn.disabled = !isFilled;
  }

  // タイマー（任意・省略可）
  if (timerEl) {
    let seconds = 60;
    const interval = setInterval(() => {
      seconds--;
      const m = Math.floor(seconds / 60);
      const s = String(seconds % 60).padStart(2, '0');
      timerEl.textContent = `${m}:${s}s`;
      if (seconds <= 0) {
        clearInterval(interval);
        timerEl.textContent = '0:00s';
      }
    }, 1000);
  }
});