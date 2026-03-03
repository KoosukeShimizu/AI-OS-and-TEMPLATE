document.addEventListener("DOMContentLoaded", () => {
  const options = {
    root: null,
    rootMargin: "0px 0px -10% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const animType = entry.target.dataset.inview;
        entry.target.classList.add(`u-anim-${animType}`);
        observer.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll("[data-inview]").forEach((el) => observer.observe(el));
});