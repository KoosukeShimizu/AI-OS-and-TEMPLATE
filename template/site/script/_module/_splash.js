// PageTransition
//  fadeoutクラスをつけて、ページ読み込み時に削除している
//  jsPageTransitionクラスをhtmlにつけることで#つきも選択可能
//  safariではブラウザバックでキャッシュ問題があるので下部にその対策を実施
//======================

$(window).on('load',function(){
  $(".c-splash-logo").delay(1200).fadeOut('slow');//ロゴを1.2秒でフェードアウトする記述

  //=====ここからローディングエリア（splashエリア）を1.5秒でフェードアウトした後に動かしたいJSをまとめる
  $(".c-splash").delay(1500).fadeOut('slow',function(){//ローディングエリア（splashエリア）を1.5秒でフェードアウトする記述
  
      $('body').addClass('appear');//フェードアウト後bodyにappearクラス付与

  });
  //=====ここまでローディングエリア（splashエリア）を1.5秒でフェードアウトした後に動かしたいJSをまとめる
  
 //=====ここから背景が伸びた後に動かしたいJSをまとめたい場合は
  $('.c-splashbg').on('animationend', function() {    
      //この中に動かしたいJSを記載
  });
  //=====ここまで背景が伸びた後に動かしたいJSをまとめる
      
});
// const wrapper = document.querySelector(".l-wrapper");
// const pageTransitionDOMClass = 'js-pageTransition'; //pageTransitionを適用したい#つきのaタグにつけるクラス
// const linkEls = [
//   ...document.querySelectorAll('a:not([href*="#"]):not([target])'),
//   ...document.querySelectorAll('.js-pageTransition'),
// ];

// const currentHostName = window.location.hostname; //URL内だったらと条件にする

// function removeTransition(url) {
//   wrapper.classList.remove("is-transition");
//   setTimeout(() => {
//     window.location = url;
//   }, 1000);
// }
// function addTransition(url) {
//   wrapper.classList.add("is-transition");
//   setTimeout(() => {
//     window.location = url;
//   }, 1000);
// }

// // setTimeoutのdelayはbaseのwrapper::afterのtransitionと合わせる
// linkEls.forEach((linkEl) => {
//   linkEl.addEventListener("click", (e) => {
//     // command or control+クリックのときは処理しない
//     if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) return;

//     e.preventDefault(); //cancel navigate
//     e.stopPropagation(); //menuなどに伝搬されて挙動が変わる場合があるので防止
//     let url = linkEl.getAttribute("href");
//     if (url !== "" && url.indexOf(currentHostName)) {
//       removeTransition(url);
//       addTransition(url);
//     }
//   }, false);
// });


// // SafariでブラウザバックするとJSなどが解除されていない問題【bfcache】の対策
// 強制リロード
// window.addEventListener('pageshow', function (event) {
//   if (event.persisted) {
//     // bfcache発動時の処理
//     window.location.reload();
//   }
// });
