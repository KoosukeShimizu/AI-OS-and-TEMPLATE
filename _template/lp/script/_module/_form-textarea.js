document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("textarea[data-autoresize]").forEach(el => {
    el.style.height = el.scrollHeight + "px";
    el.addEventListener("input", () => {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    });
  });
});