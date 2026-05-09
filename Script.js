// ── Floating petals ──
(function spawnPetals() {
  const emojis = ['🌸','🌺','🌹','💮','✨','💕','🌼','⭐'];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left              = (Math.random() * 100) + 'vw';
    p.style.fontSize          = (12 + Math.random() * 14) + 'px';
    p.style.animationDuration = (7 + Math.random() * 10) + 's';
    p.style.animationDelay    = (Math.random() * 14) + 's';
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

// ── Text-to-Speech ──
(function initTTS() {
  const letterText = [
    "Mama Jerry...",
    "There are no words big enough... to describe how much you mean to me.",
    "You have been my shelter... in every storm.",
    "My light... in every darkness.",
    "And the warmest hug... I have ever known.",
    "Every sacrifice you made... every sleepless night...",
    "every prayer you whispered for me —",
    "I carry all of it... in my heart.",
    "You are the reason... I believe in unconditional love.",
    "Today... and every day...",
    "I am so grateful... to call you my Mama.",
    "I love you... more than all the stars above us."
  ].join(' ');

  const messageCard = document.querySelector('.message-card');
  if (!messageCard || !window.speechSynthesis) return;

  // ── Button ──
  const btnWrap = document.createElement('div');
  btnWrap.style.cssText = 'text-align:center; margin-top:16px;';

  const btn = document.createElement('button');
  btn.id = 'ttsBtn';
  btn.innerHTML = '🔊 Pa Pindot Po ma Hihi';
  btn.style.cssText = `
    background: linear-gradient(135deg, #e07ab0, #8030a0);
    color: #fff;
    border: none;
    border-radius: 50px;
    padding: 13px 30px;
    font-size: 15px;
    font-family: Georgia, serif;
    cursor: pointer;
    letter-spacing: 0.5px;
    box-shadow: 0 0 18px rgba(200,80,160,0.4);
    transition: transform 0.15s, opacity 0.15s;
    -webkit-tap-highlight-color: transparent;
  `;
  btnWrap.appendChild(btn);
  messageCard.insertAdjacentElement('afterend', btnWrap);

  let speaking = false;

  function pickMaleVoice() {
    const voices = window.speechSynthesis.getVoices();

    // Priority 1: known natural-sounding male English voices
    const priority = [
      'Google UK English Male',
      'Microsoft Ryan Online (Natural) - English (United Kingdom)',
      'Microsoft Guy Online (Natural) - English (United States)',
      'Microsoft Davis Online (Natural) - English (United States)',
      'Daniel',        // macOS/iOS male
      'Aaron',         // macOS
      'Fred',          // macOS
      'Gordon',        // macOS
      'Oliver',        // macOS
    ];

    for (const name of priority) {
      const v = voices.find(v => v.name === name);
      if (v) return v;
    }

    // Priority 2: any male-named English voice
    const maleName = voices.find(v =>
      v.lang.startsWith('en') &&
      /\b(male|man|guy|ryan|davis|guy|james|mark|david|john|thomas|oliver|aaron|fred|gordon|daniel|liam|noah)\b/i.test(v.name)
    );
    if (maleName) return maleName;

    // Priority 3: any English voice (fallback)
    return voices.find(v => v.lang.startsWith('en')) || null;
  }

  function speak() {
    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(letterText);

    const voice = pickMaleVoice();
    if (voice) utt.voice = voice;

    utt.lang   = 'en-US';
    utt.rate   = 0.82;   // slow, heartfelt
    utt.pitch  = 0.78;   // lower = more masculine, natural
    utt.volume = 1;

    utt.onstart = () => {
      speaking = true;
      btn.innerHTML = '⏹ Stop';
      btn.style.opacity = '0.85';
    };

    utt.onend = utt.onerror = () => {
      speaking = false;
      btn.innerHTML = '🔊 Pa Pindot po ma Hihi';
      btn.style.opacity = '1';
    };

    window.speechSynthesis.speak(utt);
  }

  btn.addEventListener('click', function () {
    if (speaking) {
      window.speechSynthesis.cancel();
      speaking = false;
      btn.innerHTML = '🔊 Pakinggan ang Letter';
      btn.style.opacity = '1';
      return;
    }

    // Voices may not be loaded yet on first click
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = function () {
        window.speechSynthesis.onvoiceschanged = null;
        speak();
      };
      // Trigger voice load on some browsers
      window.speechSynthesis.getVoices();
    } else {
      speak();
    }
  });

})();
