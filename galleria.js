/* Galleria: per-project image carousel / lightbox */
(function () {
  var grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  var lang = document.documentElement.lang || 'fi';
  var L = ({
    fi: { close: 'Sulje', prev: 'Edellinen', next: 'Seuraava' },
    ru: { close: 'Закрыть', prev: 'Предыдущее', next: 'Следующее' },
    en: { close: 'Close', prev: 'Previous', next: 'Next' }
  })[lang] || { close: 'Close', prev: 'Previous', next: 'Next' };

  var ov = document.createElement('div');
  ov.className = 'lb-overlay';
  ov.setAttribute('hidden', '');
  ov.innerHTML =
    '<button class="lb-close" type="button" aria-label="' + L.close + '">&times;</button>' +
    '<button class="lb-nav lb-prev" type="button" aria-label="' + L.prev + '">&#8249;</button>' +
    '<figure class="lb-figure">' +
      '<img class="lb-img" src="" alt="">' +
      '<figcaption class="lb-caption"><span class="lb-title"></span><span class="lb-count"></span></figcaption>' +
    '</figure>' +
    '<button class="lb-nav lb-next" type="button" aria-label="' + L.next + '">&#8250;</button>' +
    '<div class="lb-thumbs"></div>';
  document.body.appendChild(ov);

  var imgEl = ov.querySelector('.lb-img');
  var titleEl = ov.querySelector('.lb-title');
  var countEl = ov.querySelector('.lb-count');
  var thumbsEl = ov.querySelector('.lb-thumbs');
  var prevBtn = ov.querySelector('.lb-prev');
  var nextBtn = ov.querySelector('.lb-next');
  var closeBtn = ov.querySelector('.lb-close');
  var figEl = ov.querySelector('.lb-figure');

  var imgs = [], idx = 0, title = '';

  function render() {
    imgEl.src = imgs[idx];
    imgEl.alt = title + ' ' + (idx + 1) + '/' + imgs.length;
    titleEl.textContent = title;
    countEl.textContent = imgs.length > 1 ? '  ' + (idx + 1) + ' / ' + imgs.length : '';
    var single = imgs.length < 2;
    prevBtn.style.display = single ? 'none' : '';
    nextBtn.style.display = single ? 'none' : '';
    Array.prototype.forEach.call(thumbsEl.children, function (t, i) {
      t.classList.toggle('active', i === idx);
    });
  }

  function buildThumbs() {
    thumbsEl.innerHTML = '';
    if (imgs.length < 2) return;
    imgs.forEach(function (src, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lb-thumb';
      b.innerHTML = '<img src="' + src + '" alt="" loading="lazy">';
      b.addEventListener('click', function () { idx = i; render(); });
      thumbsEl.appendChild(b);
    });
  }

  function open(list, t, start) {
    imgs = list; title = t; idx = start || 0;
    buildThumbs();
    render();
    ov.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { ov.classList.add('open'); });
  }

  function close() {
    ov.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { ov.setAttribute('hidden', ''); imgEl.src = ''; }, 200);
  }

  function step(d) { idx = (idx + d + imgs.length) % imgs.length; render(); }

  prevBtn.addEventListener('click', function () { step(-1); });
  nextBtn.addEventListener('click', function () { step(1); });
  closeBtn.addEventListener('click', close);
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.addEventListener('keydown', function (e) {
    if (ov.hasAttribute('hidden')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  // Touch swipe on mobile
  var tx = 0;
  figEl.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
  figEl.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40 && imgs.length > 1) step(dx < 0 ? 1 : -1);
  }, { passive: true });

  // Wire up cards
  Array.prototype.forEach.call(grid.querySelectorAll('.gallery-card[data-images]'), function (card) {
    var list;
    try { list = JSON.parse(card.getAttribute('data-images')); } catch (e) { return; }
    if (!list || !list.length) return;
    var t = card.getAttribute('data-title') || '';
    var trigger = card.querySelector('.gallery-card-img');
    if (trigger) {
      trigger.style.cursor = 'zoom-in';
      trigger.addEventListener('click', function () { open(list, t, 0); });
    }
    var btn = card.querySelector('.gallery-card-btn');
    if (btn) btn.addEventListener('click', function () { open(list, t, 0); });
  });
})();
