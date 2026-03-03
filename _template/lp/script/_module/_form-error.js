//エラーになっている入力欄にError用のclassを付与する
//================
if ( $( '.c-form__parts__input .error' )[0] ) {
  $( '.c-form__parts__input .error' ).parents('.c-form__parts__input').addClass('is-error');
}

if ( $( '.c-form__parts__input .c-form__error' )[0] ) {
  $( '.c-form__parts__input .c-form__error' ).parents('.c-form__parts__input').addClass('is-error');
}


// エラーになっている入力欄がある場合、ボタン下部にエラーメッセージを表示する
if ( $( '.c-form__parts__input .c-form__error' )[0] ) {
  $( '#ji-form-error-message' ).show();
} else {
  $( '#ji-form-error-message' ).hide();
}