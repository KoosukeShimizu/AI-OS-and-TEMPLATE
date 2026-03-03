document.querySelectorAll('.p-progress').forEach(el => {
  const max = parseInt(el.dataset.max, 10);
  const value = parseInt(el.dataset.value, 10);
  let colorClass = '';

  if (value >= 6) colorClass = 'p-progress__dot--lv6';
  else if (value === 5) colorClass = 'p-progress__dot--lv5';
  else if (value === 4) colorClass = 'p-progress__dot--lv4';
  else if (value === 3) colorClass = 'p-progress__dot--lv3';
  else colorClass = 'p-progress__dot--lv2';

  for (let i = 0; i < max; i++) {
    const dot = document.createElement('span');
    dot.classList.add('p-progress__dot');
    if (i < value) dot.classList.add(colorClass);
    el.appendChild(dot);
  }
});