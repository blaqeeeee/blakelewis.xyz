// Expects window.SLIDESHOWS = { key: [ {type, src|embed, thumb, title}, ... ] }
// Each <section class="slideshow" data-slideshow="key"> gets its own
// independent instance, so multiple slideshows can live on one page.
(function () {
  const registry = window.SLIDESHOWS || {};

  function wrap(i, len) {
    return (i + len) % len;
  }

  function thumbFor(slide) {
    return slide.type === 'video' ? slide.thumb : slide.src;
  }

  function initSlideshow(root, slides) {
    const stage = root.querySelector('.slideshow-stage');
    const peekPrev = root.querySelector('.slideshow-peek-prev');
    const peekNext = root.querySelector('.slideshow-peek-next');
    const imgPrev = peekPrev ? peekPrev.querySelector('img') : null;
    const imgNext = peekNext ? peekNext.querySelector('img') : null;
    const title = root.querySelector('.slideshow-title');
    const count = root.querySelector('.slideshow-count');
    const pager = root.querySelector('.slideshow-pager');
    const prevBtn = root.querySelector('.slideshow-navlink:not(.slideshow-next)');
    const nextBtn = root.querySelector('.slideshow-navlink.slideshow-next');
    if (!stage || !slides.length) return;

    let currentIndex = 0;

    function renderStage() {
      const slide = slides[currentIndex];
      stage.innerHTML = '';
      if (slide.type === 'video') {
        const iframe = document.createElement('iframe');
        iframe.className = 'slideshow-video';
        iframe.src = slide.embed;
        iframe.title = slide.title || '';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.setAttribute('allowfullscreen', '');
        stage.appendChild(iframe);
      } else {
        const img = document.createElement('img');
        img.className = 'slideshow-img';
        img.src = slide.src;
        img.alt = slide.title || '';
        stage.appendChild(img);
      }
    }

    function renderPager() {
      if (!pager) return;
      pager.innerHTML = '';
      const windowSize = 2;
      let start = Math.max(0, currentIndex - windowSize);
      let end = Math.min(slides.length - 1, currentIndex + windowSize);
      while (end - start < windowSize * 2 && (start > 0 || end < slides.length - 1)) {
        if (start > 0) start--;
        else if (end < slides.length - 1) end++;
      }
      for (let i = start; i <= end; i++) {
        const btn = document.createElement('button');
        btn.className = 'slideshow-pager-num' + (i === currentIndex ? ' is-active' : '');
        btn.textContent = i + 1;
        btn.addEventListener('click', () => { currentIndex = i; render(); });
        pager.appendChild(btn);
      }
    }

    function render() {
      const slide = slides[currentIndex];
      renderStage();
      if (imgPrev) imgPrev.src = thumbFor(slides[wrap(currentIndex - 1, slides.length)]);
      if (imgNext) imgNext.src = thumbFor(slides[wrap(currentIndex + 1, slides.length)]);
      if (title) title.textContent = slide.title || '';
      if (count) count.textContent = (currentIndex + 1) + ' / ' + slides.length;
      renderPager();
    }

    function step(dir) {
      currentIndex = wrap(currentIndex + dir, slides.length);
      render();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => step(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => step(1));
    if (peekPrev) peekPrev.addEventListener('click', () => step(-1));
    if (peekNext) peekNext.addEventListener('click', () => step(1));

    render();
  }

  document.querySelectorAll('.slideshow[data-slideshow]').forEach(root => {
    const slides = registry[root.dataset.slideshow];
    if (slides && slides.length) initSlideshow(root, slides);
  });
})();
