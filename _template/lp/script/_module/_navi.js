(() => {
  const html = document.documentElement;
  const body = document.body;

  const removeOverlay = (overlayId) => {
    const overlay = document.querySelector(`.c-globalNav__overlay[data-id="${overlayId}"]`);
    if (!overlay) return;

    overlay.classList.remove('is-visible');

    const remove = () => overlay.remove();
    overlay.addEventListener('transitionend', remove, { once: true });

    // 保険：transitionend が発火しないケースにも対応
    setTimeout(() => {
      if (document.body.contains(overlay)) remove();
    }, 1600);
  };

  const openDrawer = (targetId, toggleBtn) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.classList.add('is-open');
    toggleBtn?.setAttribute('aria-expanded', 'true');
    html.classList.add('is-scroll-off');

    const overlay = document.createElement('div');
    const overlayId = `overlay-${Date.now()}`;
    overlay.className = 'c-globalNav__overlay';
    overlay.dataset.id = overlayId;
    body.appendChild(overlay);
    target.dataset.overlayId = overlayId;

    requestAnimationFrame(() => {
      overlay.classList.add('is-visible');
    });

    overlay.addEventListener('click', () => closeDrawer(targetId, toggleBtn));
  };

  const closeDrawer = (targetId, toggleBtn = null) => {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.classList.remove('is-open');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    html.classList.remove('is-scroll-off');

    const overlayId = target.dataset.overlayId;
    if (overlayId) removeOverlay(overlayId);
  };

  // 開くトリガー
  document.querySelectorAll('[data-nav-toggle]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const targetId = btn.getAttribute('aria-controls');
      const isOpen = document.getElementById(targetId)?.classList.contains('is-open');

      if (isOpen) {
        closeDrawer(targetId, btn);
      } else {
        openDrawer(targetId, btn);
      }
    });
  });

  // 閉じるトリガー
  document.querySelectorAll('[data-nav-close]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const targetId = btn.getAttribute('aria-controls');
      closeDrawer(targetId);
    });
  });

  // 画面リサイズで自動クローズ
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      document.querySelectorAll('.c-globalNav.is-open').forEach(nav => {
        const id = nav.getAttribute('id');
        closeDrawer(id);
      });
    }
  });
})();