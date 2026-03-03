document.querySelector('[data-avatar-trigger]')?.addEventListener('click', () => {
  document.querySelector('input[type="file"][name="avatar"]').click();
});

document.querySelector('input[type="file"][name="avatar"]')?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const img = document.querySelector('[data-avatar-img]');
    if (img) img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});



// // ファイルアップロード
// //================
// $(function () {
//   var fileToggle = $('.js-inputFile'),
//     filePreview = $('.js-inputFile-preview');
//   fileToggle.change(function () {
//     var file = $(this).prop('files')[0];
//     if (!file.type.match('image.*')) {
//       return;
//     }
//     var reader = new FileReader();
//     reader.onload = function () {
//       filePreview.html('<span><img src="' + reader.result + '"/></span>');
//     }
//     reader.readAsDataURL(file);
//   });
// });