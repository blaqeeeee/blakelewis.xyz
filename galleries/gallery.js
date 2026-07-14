// Expects window.GALLERY_IMAGES to be set before this script runs.
(function () {
  const images = window.GALLERY_IMAGES || [];
  const grid = document.getElementById('scatterGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCount = document.getElementById('lightboxCount');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
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

  function renderLightboxImage() {
    lightboxImg.src = images[currentIndex];
    lightboxCount.textContent = (currentIndex + 1) + ' / ' + images.length;
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
    currentIndex = (currentIndex + dir + images.length) % images.length;
    renderLightboxImage();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => step(-1));
  lightboxNext.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
})();
