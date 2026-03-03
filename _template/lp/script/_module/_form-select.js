// セレクトボックスの値が変更されたらclassを付与する（文字色を変更する処理のために必要）
//================
$( '.c-form__select select' ).on( 'change', function(){
  $( this ).addClass( 'is-changed' );
});