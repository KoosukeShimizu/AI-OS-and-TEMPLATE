//スムーススクロール
//======================
$('a[href^="#"]').click(function () {
  let headerHeight = $("header").innerHeight();
  let speed = 400;
  let type = 'swing';
  let href= $(this).attr("href");
  let target = $(href == "#index" ? 'html' : href);
  let position = target.offset().top - headerHeight;
  $('body,html').animate({scrollTop:position}, speed, type);
  return false;
});