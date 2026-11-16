// Photo carousel: the slide nearest the centre is shown large, the rest
// smaller on each side. Scroll, swipe, arrows, dots and keys all work.
document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
  var track = carousel.querySelector('.carousel-track');
  var slides = Array.prototype.slice.call(track.children);
  var dots = carousel.querySelector('.carousel-dots');
  var prev = carousel.querySelector('.carousel-prev');
  var next = carousel.querySelector('.carousel-next');
  var active = 0;

  slides.forEach(function (slide, i) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Photo ' + (i + 1));
    dot.addEventListener('click', function () { go(i); });
    dots.appendChild(dot);
    slide.addEventListener('click', function () { if (i !== active) go(i); });
  });

  function go(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    var slide = slides[i];
    track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2, behavior: 'smooth' });
  }

  function update() {
    var centre = track.scrollLeft + track.clientWidth / 2;
    var best = 0, bestDist = Infinity;
    slides.forEach(function (slide, i) {
      var d = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - centre);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    active = best;
    slides.forEach(function (slide, i) { slide.classList.toggle('is-active', i === active); });
    Array.prototype.forEach.call(dots.children, function (dot, i) { dot.classList.toggle('is-active', i === active); });
    prev.disabled = active === 0;
    next.disabled = active === slides.length - 1;
  }

  prev.addEventListener('click', function () { go(active - 1); });
  next.addEventListener('click', function () { go(active + 1); });
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') go(active - 1);
    if (e.key === 'ArrowRight') go(active + 1);
  });
  track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
  window.addEventListener('resize', function () { go(active); });
  update();
});
