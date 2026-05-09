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

// ── Text-to-Speech: Read the letter ──
(function initTTS() {
  const letterText = `Mama Jerry, there are no words big enough to describe how much you mean to me.
You have been my shelter in every storm, my light in every darkness,
and the warmest hug I have ever known.
Every sacrifice you made, every sleepless night, every prayer whispered
for me — I carry all of it in my heart. You are the reason I believe
in unconditional love.
Today and every day, I am grateful to call you my Mama.
I love you more than all the stars above us.`;

  // Inject TTS button after the message card
  const messageCard = document.querySelector('.message-card');
  if (!messageCard || !window.speechSynthesis) return;

  const btnWrap = document.createElement('div');
  btnWrap.style.cssText = 'text-align:center; margin-top:14px;';

  const btn = document.createElement('button');
  btn.id = 'ttsBtn';
  btn.innerHTML = '🔊 Basahin ang Letter';
  btn.style.cssText = `
    background: linear-gradient(135deg, #e07ab0, #8030a0);
    color: #fff;
    border: none;
    border-radius: 50px;
    padding: 12px 28px;
    font-size: 15px;
    font-family: Georgia, serif;
    cursor: pointer;
    letter-spacing: 0.5px;
    box-shadow: 0 0 18px rgba(200, 80, 160, 0.4);
    transition: transform 0.15s, opacity 0.15s;
  `;

  btnWrap.appendChild(btn);
  messageCard.insertAdjacentElement('afterend', btnWrap);

  let utterance = null;
  let speaking = false;

  btn.addEventListener('click', function () {
    if (!window.speechSynthesis) return;

    // If currently speaking, stop it
    if (speaking) {
      window.speechSynthesis.cancel();
      speaking = false;
      btn.innerHTML = '🔊 Basahin ang Letter';
      btn.style.opacity = '1';
      return;
    }

    // Create utterance
    utterance = new SpeechSynthesisUtterance(letterText);
    utterance.lang  = 'en-US';
    utterance.rate  = 0.88;   // slightly slow, more emotional
    utterance.pitch = 1.05;
    utterance.volume = 1;

    // Try to pick a warm female English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && /female|woman|zira|samantha|karen|moira|victoria/i.test(v.name)
    ) || voices.find(v => v.lang.startsWith('en')) || null;
    if (preferred) utterance.voice = preferred;

    utterance.onstart = function () {
      speaking = true;
      btn.innerHTML = '⏹ Ihinto ang Pagbabasa';
      btn.style.opacity = '0.85';
    };

    utterance.onend = function () {
      speaking = false;
      btn.innerHTML = '🔊 Basahin ang Letter';
      btn.style.opacity = '1';
    };

    utterance.onerror = function () {
      speaking = false;
      btn.innerHTML = '🔊 Basahin ang Letter';
      btn.style.opacity = '1';
    };

    window.speechSynthesis.speak(utterance);
  });

  // Voices load async on some browsers
  window.speechSynthesis.onvoiceschanged = function () {
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && /female|woman|zira|samantha|karen|moira|victoria/i.test(v.name)
    ) || voices.find(v => v.lang.startsWith('en')) || null;
    if (utterance && preferred) utterance.voice = preferred;
  };
})();
