//スクロールアクション
//======================
$('.js-scrollAction').each(function () {
  var $win = $(window),
      $winH = $win.height(),
      $connect = $(this),
      position = $connect.offset().top,
      current = 0,
      scroll;
  $win.on('load scroll', function () {
    scroll = $win.scrollTop();
    current = (1 - (position - scroll) / $winH) * 2 * 100;
    if (current > 99.9) {
      current = 100;
    }
    if (scroll > position - $winH) {
      $(this).css({
        width: current + '%'
      });
    }
  });
});


$(window).scroll(function() {
  const winScroll = $(this).scrollTop();
  console.log(winScroll); // 計算の参考のためスクロール量を確認（削除可）
  $('.l-wrapper').css({
    'transform': 'translate(' + winScroll*0.2 + 'px,' + winScroll*0.2 + 'px)',
    'opacity': winScroll*0.015
  });
});