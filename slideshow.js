// Expects window.SLIDES to be set before this script runs.
// Each slide: { type: 'image', src, title } or { type: 'video', embed, thumb, title }
(function () {
  const slides = window.SLIDES || [];
  const stage = document.getElementById('ssStage');
  const peekPrev = document.getElementById('ssPeekPrev');
  const peekNext = document.getElementById('ssPeekNext');
  const imgPrev = document.getElementById('ssImgPrev');
  const imgNext = document.getElementById('ssImgNext');
  const title = document.getElementById('ssTitle');
  const count = document.getElementById('ssCount');
  const pager = document.getElementById('ssPager');
  const prevBtn = document.getElementById('ssPrev');
  const nextBtn = document.getElementById('ssNext');
  if (!stage || !slides.length) return;

  let currentIndex = 0;

  function wrap(i) {
    return (i + slides.length) % slides.length;
  }

  function thumbFor(slide) {
    return slide.type === 'video' ? slide.thumb : slide.src;
  }

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
    if (imgPrev) imgPrev.src = thumbFor(slides[wrap(currentIndex - 1)]);
    if (imgNext) imgNext.src = thumbFor(slides[wrap(currentIndex + 1)]);
    if (title) title.textContent = slide.title || '';
    if (count) count.textContent = (currentIndex + 1) + ' / ' + slides.length;
    renderPager();
  }

  function step(dir) {
    currentIndex = wrap(currentIndex + dir);
    render();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => step(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => step(1));
  if (peekPrev) peekPrev.addEventListener('click', () => step(-1));
  if (peekNext) peekNext.addEventListener('click', () => step(1));
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  render();
})();
