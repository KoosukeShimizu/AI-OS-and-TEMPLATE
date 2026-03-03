// Mouse Stalker
// ==========================

// // マウスストーカー要素
// var mouseStalker

// // マウスストーカー要素の位置
// var stalker = {
//   x: 0,
//   y: 0
// }

// // マウスの位置
// var mouse = {
//   x: 0,
//   y: 0
// }

// // DOM の解析後に初期化をするためのハンドラ
// document.addEventListener('DOMContentLoaded', setup)

// // マウスの動きを監視
// document.addEventListener('mousemove', mousemove)

// // 初期化処理
// function setup() {
//   // マウスストーカー要素を取得
//   mouseStalker = document.querySelector('.js-mousestalker')

//   // 更新処理を開始
//   update()
// }

// // マウスが動くたびにマウスの位置を保持しておく
// function mousemove(e) {
//   mouse.x = e.clientX
//   mouse.y = e.clientY
// }

// // 更新処理
// function update() {
//   // マウスストーカー要素の位置を更新
//   stalker.x += (mouse.x - stalker.x) * 0.1
//   stalker.y += (mouse.y - stalker.y) * 0.1

//   // マウスストーカーの位置を小数点第一位まで四捨五入
//   var x = Math.round(stalker.x * 10) / 10
//   var y = Math.round(stalker.y * 10) / 10

//   // マウスストーカー要素のスタイルを更新
//   mouseStalker.style.transform = `translate3d(` + x + 'px,' + y + 'px, 0)'

//   // ループ
//   requestAnimationFrame(update)
// }

// //準備
// let cursorR = 4;  //カーソルの半径
// const cursor = document.querySelector('.js-stalker');  //カーソル用のdivを取得

// //上記のdivタグをマウスに追従させる処理
// document.addEventListener('mousemove', function (e) {
//     cursor.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
// });

//リンクにホバー時はクラスをつける
// const linkElem = document.querySelectorAll('a');
// for (let i = 0; i < linkElem.length; i++) {
//     linkElem[i].addEventListener('mouseover', function (e) {
//         cursor.classList.add('hov_');
//     });
//     linkElem[i].addEventListener('mouseout', function (e) {
//         cursor.classList.remove('hov_');      
//     });
// }


//マウスストーカー用のdivを取得
// const stalker = document.getElementById('stalker');
const stalker = document.querySelector('.js-stalker');

//aタグにホバー中かどうかの判別フラグ
let hovFlag = false;

//マウスに追従させる処理 （リンクに吸い付いてる時は除外する）
document.addEventListener('mousemove', function (e) {
    // if (!hovFlag) {
    stalker.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
    // }
});

//リンクへ吸い付く処理
const linkElem = document.querySelectorAll('a:not(.no_stick_),button');
for (let i = 0; i < linkElem.length; i++) {
    //マウスホバー時
    linkElem[i].addEventListener('mouseover', function (e) {
        hovFlag = true;

        //マウスストーカーにクラスをつける
        stalker.classList.add('is-hover');

        // //マウスストーカーの位置をリンクの中心に固定
        // let rect = e.target.getBoundingClientRect();
        // let posX = rect.left + (rect.width / 2);
        // let posY = rect.top + (rect.height / 2);

        // stalker.style.transform = 'translate(' + posX + 'px, ' + posY + 'px)';

    });
    //マウスホバー解除時
    linkElem[i].addEventListener('mouseout', function (e) {
        hovFlag = false;
        stalker.classList.remove('is-hover');
    });
}




