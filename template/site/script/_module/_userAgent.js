//ユーザーエージェント
//======================

// 変数
var ua = navigator.userAgent; // ユーザーエージェント
var htmlElement = document.documentElement;

// UserAgentで振り分けてhtmlにclassを振る
if (navigator.platform.search("Mac") != -1) {
  htmlElement.className += ' ua-mac ua-pc';
}
if (ua.search("Windows") != -1) {
  htmlElement.className += ' ua-win ua-pc';
  if ((ua.search("Trident") != -1) || ((ua.search("MSIE") != -1))) {
    htmlElement.className += ' ua-ie ua-pc';
    if(ua.search("Trident") != -1) { htmlElement.className += ' gte_ie8 ua-pc'; }
    if(ua.search("Trident") == -1) { htmlElement.className += ' lte_ie8 ua-pc'; }
    if(ua.search("MSIE 7") != -1){ htmlElement.className += ' ie7 ua-pc'; }
    if(ua.search("MSIE 8") != -1){ htmlElement.className += ' ie8 ua-pc'; }
    if (ua.search("MSIE 9") != -1) {
      htmlElement.className += ' ua-ie9 ua-pc';
    }
    if (ua.search("MSIE 10") != -1) {
      htmlElement.className += ' ua-ie10 ua-pc';
    }
    if (ua.search("Trident/7") != -1) {
      htmlElement.className += ' ua-ie11 ua-pc';
    }
  }
}
if ((ua.search("Chrome") != -1) && (ua.search("OPR") == -1)) {
  htmlElement.className += ' ua-chrome ';
}
if ((ua.search("Safari") != -1) && (ua.search("Chrome") == -1) && (ua.search("OPR") == -1) && (ua.search("Presto") == -1)) {
  htmlElement.className += ' ua-safari ';
}
if (ua.search("Firefox") != -1) {
  htmlElement.className += ' ua-firefox ';
}

if (ua.search("iPad") != -1) {
  htmlElement.className += ' ipad ua-tab ua-sp';
}
if ((ua.search("Android") != -1) && (ua.search("mobile") == 0)) {
  htmlElement.className += ' ua-androidTab ua-tab ua-sp';
}
if ((ua.search("firefox") != -1) && (ua.search("tablet") == 0)) {
  htmlElement.className += ' ua-firefoxTab ua-tab ua-sp';
}
if (ua.search("kindle") != -1) {
  htmlElement.className += ' ua-kindle ua-tab ua-sp';
}
if (ua.search("silk") != -1) {
  htmlElement.className += ' ua-silk ua-tab ua-sp';
}
if (ua.search("playbook") != -1) {
  htmlElement.className += ' ua-playbook ua-tab ua-sp';
}

if (ua.search("iPhone") != -1) {
  htmlElement.className += ' ua-iphone ua-sp';
}
if (ua.search("iPod") != -1) {
  htmlElement.className += ' ua-ipod ua-sp';
}
if (ua.search("Android") != -1) {
  htmlElement.className += ' ua-android ua-sp';
}
if ((ua.search("Android") != -1) && (ua.search("mobile") == -1)) {
  htmlElement.className += ' ua-androidMobile ua-sp';
}
if ((ua.search("firefox") != -1) && (ua.search("mobile") == -1)) {
  htmlElement.className += ' ua-firefoxMobile ua-sp';
}
if (ua.search("blackberry") != -1) {
  htmlElement.className += ' ua-blackberry ua-sp';
}
if (ua.search("windows Phone") != -1) {
  htmlElement.className += ' ua-windowsPhone ua-sp';
}

$(window).on('load resize', function () {
  if (window.innerHeight > window.innerWidth) { //ポートレートなら
    $("html").addClass("ua-portrait");
    $("html").removeClass("ua-landscape");
  } else { //ランドスケープなら
    $("html").addClass("ua-landscape");
    $("html").removeClass("ua-portrait");
  }
});