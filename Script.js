// ── Floating petals ──
(function spawnPetals() {
  const emojis = ['🌸','🌺','🌹','💮','✨','💕','🌼','⭐'];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left             = (Math.random() * 100) + 'vw';
    p.style.fontSize         = (12 + Math.random() * 14) + 'px';
    p.style.animationDuration  = (7 + Math.random() * 10) + 's';
    p.style.animationDelay     = (Math.random() * 14) + 's';
    frag.appendChild(p);
  }
  document.getElementById('petals').appendChild(frag);
})();

// ── Sparkle on tap/click ──
(function initSparkles() {
  const pool = ['✨','💫','🌟','💕','🌸','🌺'];
  function spawn(x, y) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.textContent = pool[Math.floor(Math.random() * pool.length)];
    s.style.left = (x - 10) + 'px';
    s.style.top  = (y - 10) + 'px';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  }
  document.addEventListener('click',      e => spawn(e.clientX, e.clientY));
  document.addEventListener('touchstart', e => {
    const t = e.touches[0];
    spawn(t.clientX, t.clientY);
  }, { passive: true });
})();

// ── Scroll-triggered fade-in ──
(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();