document.addEventListener("DOMContentLoaded", () => {
  const pageTop = document.querySelector("[data-pagetop]");
  if (!pageTop) return;
  pageTop.addEventListener("click", () => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 10);
  });
});