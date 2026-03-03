// magnificpopup トリガー
//======================
$(function(){
  $('.js-popup-iframe').magnificPopup({
    type: 'iframe',
    disableOn: 300,
    mainClass: 'mfp-fade',
    removalDelay: 200,
    preloader: false,
    fixedContentPos: true
  });
});



$(function(){
  $('.js_popup-movie').magnificPopup({
    type: 'iframe',
    disableOn: 300,
    mainClass: 'mfp-fade',
    removalDelay: 200,
    preloader: false,
    fixedContentPos: true
  });
});


$(function(){
  $('.js_popup-youtube').magnificPopup({
    type: 'iframe',
    iframe: {
      patterns: {
        youtube: {
          index: 'youtube.com',
          id: 'v=',
          src: '//www.youtube.com/embed/%id%?autoplay=1&rel=0&showinfo=0'
        }
      }
    },
    disableOn: 300,
    mainClass: 'mfp-fade',
    removalDelay: 200,
    preloader: false,
    fixedContentPos: true
  });
});