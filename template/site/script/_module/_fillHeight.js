//Fill Height
// スマホの100vhの高さ調整
// .hoge{
// height: 100vh; /* Fallback */
// height: calc(var(--vh, 1vh) * 100);
// }
//======================
function setHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setHeight();
window.addEventListener('resize', setHeight);