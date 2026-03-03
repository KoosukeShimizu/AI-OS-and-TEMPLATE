// TOC
// ==========================
document.addEventListener('DOMContentLoaded', function () {
  var contentsList = document.getElementById('js-toc'); // 目次を追加する先(table of contents)
  var div = document.createElement('ol'); // 作成する目次のコンテナ要素
  div.classList.add("c-toc__list");
  // .entry-content配下のh2、h3要素を全て取得する
  var matches = document.querySelectorAll('.c-single__content h2, .c-single__content h3');
  // 取得した見出しタグ要素の数だけ以下の操作を繰り返す
  matches.forEach(function (value, i) {
    // 見出しタグ要素のidを取得し空の場合は内容をidにする
    var id = value.id;
    if(id === '') {
      id = value.textContent;
      value.id = id;
    }

    // 要素がh2タグの場合
    if(value.tagName === 'H2') {
      //- var ul = document.createElement('ul');
      var li = document.createElement('li');
      var a = document.createElement('a');
      //- ul.classList.add("h2ul");
      li.classList.add("c-toc__h2");
      a.classList.add("c-toc__link");

      // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
      a.innerHTML = value.textContent;
      a.href = '#' + value.id;
      li.appendChild(a)
      //- ul.appendChild(li);

      // コンテナ要素である<div>の中に要素を追加する
      div.appendChild(li);
    }

    // 要素がh3タグの場合
    if (value.tagName === 'H3') {
      var ol = document.createElement('ol');
      var li = document.createElement('li');
      var a = document.createElement('a');
      ol.classList.add("c-toc__child");
      li.classList.add("c-toc__h3");
      a.classList.add("c-toc__link");

      // コンテナ要素である<div>の中から最後の<li>を取得する。
      //- var lastUl = div.lastElementChild;
      var lastLi = div.lastElementChild;

      // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
      a.innerHTML = value.textContent;
      a.href = '#' + value.id;
      li.appendChild(a)
      // ol.appendChild(li);

      // 最後の<li>の中に要素を追加する
      lastLi.appendChild(li);
      
      contentsList.appendChild(ol);
    }
  });

  // 最後に画面にレンダリング
  // contentsList.appendChild(div);
});