(() => {
  const header = document.querySelector('[data-sticky-header]');
  const wrapper = document.querySelector('.l-wrapper');

  if (!header || !wrapper) {
    console.warn('data-sticky-header または .l-wrapper が見つかりません');
    return;
  }

  // スクロール方向と位置によってクラスを制御
  let lastScroll = window.scrollY;
  let ticking = false;

  const updateHeaderState = () => {
    const currentScroll = window.scrollY;

    if (currentScroll <= 0) {
      header.classList.remove('is-sticky', 'is-hide');
    } else {
      header.classList.add('is-sticky');

      if (currentScroll > lastScroll && currentScroll > 80) {
        header.classList.add('is-hide');
      } else if (currentScroll < lastScroll) {
        header.classList.remove('is-hide');
      }
    }

    lastScroll = currentScroll;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeaderState);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll);
  window.addEventListener('load', updateHeaderState);

  // ヘッダー高さ分の padding-top を .l-wrapper に設定
  const setWrapperPadding = () => {
    const headerHeight = header.offsetHeight;
    wrapper.style.paddingTop = `${headerHeight}px`;
  };

  window.addEventListener('load', setWrapperPadding);
  window.addEventListener('resize', setWrapperPadding);
})();