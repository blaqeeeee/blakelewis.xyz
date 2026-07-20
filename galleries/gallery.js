// Expects window.GALLERY_IMAGES to be set before this script runs.
(function () {
  const images = window.GALLERY_IMAGES || [];
  const grid = document.getElementById('scatterGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxImgPrev = document.getElementById('lightboxImgPrev');
  const lightboxImgNext = document.getElementById('lightboxImgNext');
  const lightboxCount = document.getElementById('lightboxCount');
  const lightboxPager = document.getElementById('lightboxPager');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxPeekPrev = document.getElementById('lightboxPeekPrev');
  const lightboxPeekNext = document.getElementById('lightboxPeekNext');
  let currentIndex = 0;

  // Build scatter grid
  images.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'scatter-item';
    const img = document.createElement('img');
    img.src = src;
    img.loading = 'lazy';
    img.alt = '';
    item.appendChild(img);
    item.addEventListener('click', () => openLightbox(i));
    grid.appendChild(item);
  });

  function wrap(i) {
    return (i + images.length) % images.length;
  }

  function renderPager() {
    lightboxPager.innerHTML = '';
    const windowSize = 2;
    let start = Math.max(0, currentIndex - windowSize);
    let end = Math.min(images.length - 1, currentIndex + windowSize);
    while (end - start < windowSize * 2 && (start > 0 || end < images.length - 1)) {
      if (start > 0) start--;
      else if (end < images.length - 1) end++;
    }
    for (let i = start; i <= end; i++) {
      const btn = document.createElement('button');
      btn.className = 'lightbox-pager-num' + (i === currentIndex ? ' is-active' : '');
      btn.textContent = i + 1;
      btn.addEventListener('click', () => { currentIndex = i; renderLightboxImage(); });
      lightboxPager.appendChild(btn);
    }
  }

  function renderLightboxImage() {
    lightboxImg.src = images[currentIndex];
    if (lightboxImgPrev) lightboxImgPrev.src = images[wrap(currentIndex - 1)];
    if (lightboxImgNext) lightboxImgNext.src = images[wrap(currentIndex + 1)];
    lightboxCount.textContent = (currentIndex + 1) + ' / ' + images.length;
    if (lightboxPager) renderPager();
  }
  function openLightbox(index) {
    currentIndex = index;
    renderLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function step(dir) {
    currentIndex = wrap(currentIndex + dir);
    renderLightboxImage();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => step(-1));
  lightboxNext.addEventListener('click', () => step(1));
  if (lightboxPeekPrev) lightboxPeekPrev.addEventListener('click', () => step(-1));
  if (lightboxPeekNext) lightboxPeekNext.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();
