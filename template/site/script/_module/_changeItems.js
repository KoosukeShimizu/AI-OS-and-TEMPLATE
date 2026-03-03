//Change items
//要素を順番に入れ替える
//======================
const txts = document.getElementsByClassName('js-change-item');
let txtIndex = -1;
function changeTxt() {
  txtIndex++;
  let currentNum = txtIndex % txts.length;
  let nextNum = (txtIndex + 1) % txts.length;
  let current = txts[currentNum];
  let next = txts[nextNum];
  setTimeout(function () {
    current.classList.remove('is-active');
  }, 5000);
  setTimeout(function () {
    current.style.display = 'none';
    next.style.display = 'inline-block';
  }, 5300);
  setTimeout(function () {
    next.classList.add('is-active');
  }, 5800);
}
function showNextTxt() {
  setInterval(changeTxt, 8200);
}
changeTxt();
document.addEventListener('DOMContentLoaded', showNextTxt, false);