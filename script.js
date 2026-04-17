const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const state = {
  boxOpen: false,
  musicOn: false,
  secretClicks: 0,
  loadingDone: false,
  audioContext: null,
  audioFadeTimer: null,
  musicTimer: null,
  currentFocus: null,
};

const popoutItems = [
  {
    title: 'memory 01',
    date: '',
    caption: '',
    image: 'IMG1.PNG',
    palette: ['#dbe8f8', '#fbfdff'],
    accent: '#6f94c5',
    width: 'clamp(8.8rem, 24vw, 13rem)',
    widthMobile: 'clamp(7.8rem, 60vw, 12rem)',
    aspectRatio: '16 / 9',
    aspectRatioMobile: '16 / 9',
    fit: 'contain',
    x: '0rem',
    y: 'clamp(-8rem, -10vh, -5rem)',
    rotate: '0deg',
    mobileX: '0rem',
    mobileY: 'clamp(-5.2rem, -12vw, -4.2rem)',
    mobileRotate: '0deg',
    delay: '120ms',
    z: 7,
  },
  {
    title: 'memory 02',
    date: '',
    caption: '',
    image: 'IMG2.jpeg',
    palette: ['#d6e3f4', '#f8fbff'],
    accent: '#5f84b8',
    width: 'clamp(6.2rem, 17vw, 9rem)',
    widthMobile: 'clamp(5.4rem, 20vw, 7rem)',
    aspectRatio: '3 / 4',
    aspectRatioMobile: '3 / 4',
    fit: 'cover',
    x: 'clamp(9.5rem, 22vw, 16rem)',
    y: 'clamp(-4rem, -5vh, -1rem)',
    rotate: '12deg',
    mobileX: 'clamp(5.8rem, 20vw, 6.8rem)',
    mobileY: 'clamp(-3.8rem, -10vw, -2.2rem)',
    mobileRotate: '12deg',
    delay: '220ms',
    z: 5,
  },
  {
    title: 'memory 03',
    date: '',
    caption: '',
    image: 'IMG3.jpeg',
    palette: ['#dfe9f8', '#fafdff'],
    accent: '#7b9fcf',
    width: 'clamp(6.2rem, 17vw, 9rem)',
    widthMobile: 'clamp(5.4rem, 20vw, 7rem)',
    aspectRatio: '3 / 4',
    aspectRatioMobile: '3 / 4',
    fit: 'cover',
    x: 'clamp(-9.5rem, -22vw, -16rem)',
    y: 'clamp(-4rem, -5vh, -1rem)',
    rotate: '-12deg',
    mobileX: 'clamp(-6.8rem, -20vw, -5.8rem)',
    mobileY: 'clamp(-3.8rem, -10vw, -2.2rem)',
    mobileRotate: '-12deg',
    delay: '320ms',
    z: 4,
  },
  {
    title: 'memory 04',
    date: '',
    caption: '',
    image: 'IMG4.jpeg',
    palette: ['#dce5f3', '#f8fbff'],
    accent: '#829abe',
    width: 'clamp(6.2rem, 17vw, 9rem)',
    widthMobile: 'clamp(5.4rem, 20vw, 7rem)',
    aspectRatio: '3 / 4',
    aspectRatioMobile: '3 / 4',
    fit: 'cover',
    x: 'clamp(9.5rem, 22vw, 16rem)',
    y: 'clamp(4rem, 7vh, 7rem)',
    rotate: '8deg',
    mobileX: 'clamp(5.8rem, 20vw, 6.8rem)',
    mobileY: 'clamp(3rem, 8vw, 4.4rem)',
    mobileRotate: '8deg',
    delay: '420ms',
    z: 3,
  },
  {
    title: 'memory 05',
    date: '',
    caption: '',
    image: 'IMG5.jpeg',
    palette: ['#d9e6f4', '#f7fbff'],
    accent: '#7a99c4',
    width: 'clamp(6.2rem, 17vw, 9rem)',
    widthMobile: 'clamp(5.4rem, 20vw, 7rem)',
    aspectRatio: '3 / 4',
    aspectRatioMobile: '3 / 4',
    fit: 'cover',
    x: 'clamp(-9.5rem, -22vw, -16rem)',
    y: 'clamp(4rem, 7vh, 7rem)',
    rotate: '-8deg',
    mobileX: 'clamp(-6.8rem, -20vw, -5.8rem)',
    mobileY: 'clamp(3rem, 8vw, 4.4rem)',
    mobileRotate: '-8deg',
    delay: '520ms',
    z: 2,
  },
  {
    title: 'memory 06',
    date: '',
    caption: '',
    image: 'IMG6.jpeg',
    palette: ['#dfe9f8', '#ffffff'],
    accent: '#5d84b8',
    width: 'clamp(6.2rem, 17vw, 9rem)',
    widthMobile: 'clamp(5.4rem, 20vw, 7rem)',
    aspectRatio: '3 / 4',
    aspectRatioMobile: '3 / 4',
    fit: 'cover',
    x: '0rem',
    y: 'clamp(8rem, 12vh, 11rem)',
    rotate: '0deg',
    mobileX: '0rem',
    mobileY: 'clamp(5.2rem, 14vw, 7rem)',
    mobileRotate: '0deg',
    delay: '620ms',
    z: 1,
  },
];

const elements = {
  body: document.body,
  loader: document.getElementById('loader'),
  particleField: document.getElementById('particleField'),
  openBoxButton: document.getElementById('openBoxButton'),
  memoryBox: document.getElementById('memoryBox'),
  boxPopouts: document.getElementById('boxPopouts'),
  musicToggle: document.getElementById('musicToggle'),
  secretHeart: document.getElementById('secretHeart'),
  secretCount: document.getElementById('secretCount'),
  memoryModal: document.getElementById('memoryModal'),
  modalImage: document.getElementById('modalImage'),
  modalCopy: document.querySelector('.modal__copy'),
  modalDate: document.getElementById('modalDate'),
  modalTitle: document.getElementById('memoryModalTitle'),
  modalCaption: document.getElementById('modalCaption'),
  secretOverlay: document.getElementById('secretOverlay'),
  closeModalButtons: document.querySelectorAll('[data-close-modal]'),
  closeSecretButtons: document.querySelectorAll('[data-close-secret]'),
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getTrimmedText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isGenericMemoryTitle(title) {
  return /^memory\s*\d+$/i.test(getTrimmedText(title));
}

function getDisplayTitle(title) {
  const normalizedTitle = getTrimmedText(title);
  return isGenericMemoryTitle(normalizedTitle) ? '' : normalizedTitle;
}

function createMemorySvg(item, index) {
  const leftColor = item.palette[0];
  const rightColor = item.palette[1];
  const accent = item.accent;
  const displayTitle = getDisplayTitle(item.title) || 'Memory';
  const safeTitle = escapeXml(displayTitle);
  const safeDate = escapeXml(getTrimmedText(item.date));
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 800" role="img" aria-label="${safeTitle}">
      <defs>
        <linearGradient id="bg-${index}" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${leftColor}" />
          <stop offset="100%" stop-color="${rightColor}" />
        </linearGradient>
        <radialGradient id="glow-${index}" cx="50%" cy="34%" r="64%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="60%" stop-color="#ffffff" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="800" rx="48" fill="url(#bg-${index})" />
      <circle cx="520" cy="130" r="140" fill="#ffffff" fill-opacity="0.28" />
      <circle cx="126" cy="596" r="180" fill="#ffffff" fill-opacity="0.18" />
      <circle cx="320" cy="320" r="220" fill="url(#glow-${index})" />
      <rect x="68" y="76" width="504" height="648" rx="36" fill="#ffffff" fill-opacity="0.24" stroke="#ffffff" stroke-opacity="0.46" stroke-width="2" />
      <g opacity="0.34" fill="${accent}">
        <path d="M470 184c24 0 44 18 44 42 0 42-54 73-78 85-24-12-78-43-78-85 0-24 20-42 44-42 14 0 26 6 34 17 8-11 20-17 34-17Z" />
        <path d="M140 540c19 0 35 14 35 33 0 33-43 58-61 66-18-8-61-33-61-66 0-19 16-33 35-33 11 0 20 4 26 13 6-9 15-13 26-13Z" />
      </g>
      <text x="96" y="150" fill="#463943" font-family="Poppins, Inter, sans-serif" font-size="42" font-weight="700" letter-spacing="5">${safeTitle.toUpperCase()}</text>
      <text x="96" y="224" fill="#6f5e67" font-family="Inter, sans-serif" font-size="26">a soft memory from us</text>
      <text x="96" y="648" fill="#7c6973" font-family="Inter, sans-serif" font-size="24" letter-spacing="2">${safeDate}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function resolveMemoryMedia(item, index) {
  const fallback = createMemorySvg(item, index);
  const source = typeof item.image === 'string' && item.image.trim() ? item.image.trim() : fallback;
  return { source, fallback };
}

function bindImageFallback(imageElement, source, fallback, altText) {
  imageElement.alt = altText;
  imageElement.src = source;
  imageElement.onerror = source === fallback
    ? null
    : () => {
        imageElement.onerror = null;
        imageElement.src = fallback;
      };
}

function buildParticles() {
  if (prefersReducedMotion || !elements.particleField) {
    return;
  }

  const totalParticles = 18;
  for (let index = 0; index < totalParticles; index += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    const size = 6 + Math.random() * 18;
    const left = Math.random() * 100;
    const duration = 12 + Math.random() * 10;
    const delay = -Math.random() * duration;
    const drift = (Math.random() * 2 - 1) * 120;
    const opacity = 0.18 + Math.random() * 0.38;
    particle.style.setProperty('--size', `${size}px`);
    particle.style.setProperty('--left', `${left}%`);
    particle.style.setProperty('--duration', `${duration}s`);
    particle.style.setProperty('--delay', `${delay}s`);
    particle.style.setProperty('--drift', `${drift}px`);
    particle.style.setProperty('--opacity', opacity.toFixed(2));
    elements.particleField.appendChild(particle);
  }
}

function renderPopouts() {
  if (!elements.boxPopouts) {
    return;
  }

  elements.boxPopouts.innerHTML = '';

  popoutItems.forEach((item, index) => {
    const displayTitle = getDisplayTitle(item.title);
    const displayDate = getTrimmedText(item.date);
    const ariaLabel = displayTitle || displayDate
      ? `Open photo: ${[displayTitle, displayDate].filter(Boolean).join(', ')}`
      : `Open photo ${index + 1}`;
    const artworkAlt = displayTitle ? `${displayTitle} memory artwork` : `Memory photo ${index + 1}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'popout-card';
    button.style.setProperty('--popout-width', item.width);
    button.style.setProperty('--popout-width-mobile', item.widthMobile || item.width);
    button.style.setProperty('--popout-aspect', item.aspectRatio);
    button.style.setProperty('--popout-aspect-mobile', item.aspectRatioMobile || item.aspectRatio);
    button.style.setProperty('--popout-fit', item.fit || 'cover');
    button.style.setProperty('--popout-x', item.x);
    button.style.setProperty('--popout-y', item.y);
    button.style.setProperty('--popout-rotate', item.rotate);
    button.style.setProperty('--popout-x-mobile', item.mobileX);
    button.style.setProperty('--popout-y-mobile', item.mobileY);
    button.style.setProperty('--popout-rotate-mobile', item.mobileRotate);
    button.style.setProperty('--popout-delay', item.delay);
    button.style.setProperty('--popout-z', String(item.z || index + 1));
    button.setAttribute('aria-label', ariaLabel);

    const media = resolveMemoryMedia(item, index);
    button.innerHTML = `
      <div class="popout-card__frame">
        <img alt="${artworkAlt}" loading="lazy" />
      </div>
    `;

    const image = button.querySelector('img');
    if (image) {
      bindImageFallback(image, media.source, media.fallback, artworkAlt);
    }

    button.addEventListener('click', () => openMemoryModal(item, media, index));
    elements.boxPopouts.appendChild(button);
  });
}

function openBox() {
  if (state.boxOpen) {
    return;
  }

  state.boxOpen = true;
  elements.body.classList.add('box-open');
}

function openMemoryModal(item, media, index) {
  const displayTitle = getDisplayTitle(item.title);
  const displayDate = getTrimmedText(item.date);
  const displayCaption = getTrimmedText(item.caption);
  const hasMetadata = Boolean(displayTitle || displayDate || displayCaption);
  const modalAlt = displayTitle ? `${displayTitle} memory photo` : `Memory photo ${index + 1}`;

  closeSecretOverlay();
  state.currentFocus = document.activeElement;
  bindImageFallback(elements.modalImage, media.source, media.fallback, modalAlt);
  elements.modalDate.textContent = displayDate;
  elements.modalTitle.textContent = displayTitle;
  elements.modalCaption.textContent = displayCaption;
  elements.modalDate.hidden = !displayDate;
  elements.modalTitle.hidden = !displayTitle;
  elements.modalCaption.hidden = !displayCaption;
  if (elements.modalCopy) {
    elements.modalCopy.hidden = !hasMetadata;
  }
  elements.memoryModal.classList.add('is-open');
  elements.memoryModal.setAttribute('aria-hidden', 'false');
  elements.body.classList.add('is-modal-open');
  const closeButton = elements.memoryModal.querySelector('.modal__close');
  if (closeButton) {
    closeButton.focus();
  }
}

function closeMemoryModal() {
  if (!elements.memoryModal.classList.contains('is-open')) {
    return;
  }

  elements.memoryModal.classList.remove('is-open');
  elements.memoryModal.setAttribute('aria-hidden', 'true');
  if (!elements.secretOverlay.classList.contains('is-open')) {
    elements.body.classList.remove('is-modal-open');
  }
  if (state.currentFocus && typeof state.currentFocus.focus === 'function') {
    state.currentFocus.focus();
  }
}

function openSecretOverlay() {
  closeMemoryModal();
  state.currentFocus = document.activeElement;
  elements.secretOverlay.classList.add('is-open');
  elements.secretOverlay.setAttribute('aria-hidden', 'false');
  elements.body.classList.add('is-modal-open');
  const closeButton = elements.secretOverlay.querySelector('.secret-overlay__close');
  if (closeButton) {
    closeButton.focus();
  }
}

function closeSecretOverlay() {
  if (!elements.secretOverlay.classList.contains('is-open')) {
    return;
  }

  elements.secretOverlay.classList.remove('is-open');
  elements.secretOverlay.setAttribute('aria-hidden', 'true');
  if (!elements.memoryModal.classList.contains('is-open')) {
    elements.body.classList.remove('is-modal-open');
  }
  if (state.currentFocus && typeof state.currentFocus.focus === 'function') {
    state.currentFocus.focus();
  }
}

function updateSecretCount() {
  elements.secretCount.textContent = `${state.secretClicks}/5`;
}

function triggerSecretHeart() {
  state.secretClicks += 1;
  updateSecretCount();

  if (state.secretClicks >= 5) {
    state.secretClicks = 0;
    updateSecretCount();
    openSecretOverlay();
  }
}

function setupRevealObserver() {
  const targets = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px',
    }
  );

  targets.forEach((element) => observer.observe(element));
}

function startAmbientChord(context, masterGain, chord) {
  const startTime = context.currentTime;
  const chordGain = context.createGain();
  chordGain.gain.setValueAtTime(0.0001, startTime);
  chordGain.gain.exponentialRampToValueAtTime(0.14, startTime + 0.7);
  chordGain.gain.setTargetAtTime(0.1, startTime + 1.2, 0.5);
  chordGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 4.2);
  chordGain.connect(masterGain);

  chord.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const voiceGain = context.createGain();
    oscillator.type = index === 1 ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.detune.setValueAtTime(index * 5, startTime);
    voiceGain.gain.value = index === 0 ? 0.08 : 0.06;
    oscillator.connect(voiceGain).connect(chordGain);
    oscillator.start(startTime);
    oscillator.stop(startTime + 4.35);
  });
}

function startMusic() {
  if (state.audioFadeTimer) {
    window.clearTimeout(state.audioFadeTimer);
    state.audioFadeTimer = null;
  }

  if (state.audioContext && state.audioContext.context.state === 'closed') {
    state.audioContext = null;
  }

  if (!state.audioContext) {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = context.createGain();
    masterGain.gain.value = 0.16;
    masterGain.connect(context.destination);
    state.audioContext = { context, masterGain };
  }

  const { context, masterGain } = state.audioContext;
  const chords = [
    [196, 246.94, 293.66],
    [174.61, 220, 261.63],
    [220, 277.18, 329.63],
    [185, 233.08, 293.66],
  ];

  if (context.state === 'suspended') {
    context.resume();
  }

  const now = context.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
  masterGain.gain.exponentialRampToValueAtTime(0.16, now + 0.24);

  if (state.musicTimer) {
    window.clearInterval(state.musicTimer);
  }

  let chordIndex = 0;
  startAmbientChord(context, masterGain, chords[chordIndex]);
  chordIndex += 1;
  state.musicTimer = window.setInterval(() => {
    startAmbientChord(context, masterGain, chords[chordIndex % chords.length]);
    chordIndex += 1;
  }, 3400);

  state.musicOn = true;
  elements.musicToggle.setAttribute('aria-pressed', 'true');
  elements.musicToggle.querySelector('.icon-button__label').textContent = 'music on';
}

function stopMusic() {
  state.musicOn = false;
  elements.musicToggle.setAttribute('aria-pressed', 'false');
  elements.musicToggle.querySelector('.icon-button__label').textContent = 'music off';

  if (state.audioFadeTimer) {
    window.clearTimeout(state.audioFadeTimer);
    state.audioFadeTimer = null;
  }

  if (state.musicTimer) {
    window.clearInterval(state.musicTimer);
    state.musicTimer = null;
  }

  if (state.audioContext) {
    const { context, masterGain } = state.audioContext;
    const now = context.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    state.audioFadeTimer = window.setTimeout(() => {
      Promise.resolve(context.close())
        .catch(() => {
          // Ignore close errors and continue with state cleanup.
        })
        .finally(() => {
          if (state.audioContext && state.audioContext.context === context) {
            state.audioContext = null;
          }
          state.audioFadeTimer = null;
        });
    }, 380);
  }
}

function toggleMusic() {
  if (state.musicOn) {
    stopMusic();
    return;
  }

  startMusic();
}

function setupEventListeners() {
  if (elements.openBoxButton) {
    elements.openBoxButton.addEventListener('click', openBox);
  }

  if (elements.memoryBox) {
    elements.memoryBox.addEventListener('click', openBox);
  }

  if (elements.secretHeart) {
    elements.secretHeart.addEventListener('click', triggerSecretHeart);
  }

  if (elements.musicToggle) {
    elements.musicToggle.addEventListener('click', toggleMusic);
  }

  elements.closeModalButtons.forEach((button) => button.addEventListener('click', closeMemoryModal));
  elements.closeSecretButtons.forEach((button) => button.addEventListener('click', closeSecretOverlay));

  elements.memoryModal.addEventListener('click', (event) => {
    if (event.target === elements.memoryModal || event.target.classList.contains('modal__backdrop')) {
      closeMemoryModal();
    }
  });

  elements.secretOverlay.addEventListener('click', (event) => {
    if (event.target === elements.secretOverlay || event.target.classList.contains('secret-overlay__backdrop')) {
      closeSecretOverlay();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMemoryModal();
      closeSecretOverlay();
    }
  });
}

function finishLoading() {
  if (state.loadingDone) {
    return;
  }

  state.loadingDone = true;
  elements.body.classList.remove('is-loading');
}

function waitForWindowLoad() {
  if (document.readyState === 'complete') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.addEventListener('load', resolve, { once: true });
  });
}

function waitForMemoryImages(timeoutMs) {
  const imageSources = [...new Set(popoutItems
    .map((item, index) => resolveMemoryMedia(item, index).source)
    .filter((source) => typeof source === 'string' && source && !source.startsWith('data:')),
  )];

  if (!imageSources.length) {
    return Promise.resolve();
  }

  const imagePromises = imageSources.map((source) => new Promise((resolve) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = resolve;
    image.src = source;
  }));

  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(resolve, timeoutMs);
    Promise.allSettled(imagePromises).then(() => {
      window.clearTimeout(timeoutId);
      resolve();
    });
  });
}

function init() {
  buildParticles();
  renderPopouts();
  setupRevealObserver();
  setupEventListeners();
  updateSecretCount();

  if (prefersReducedMotion) {
    finishLoading();
    return;
  }

  Promise.allSettled([
    waitForWindowLoad(),
    waitForMemoryImages(3200),
  ]).then(finishLoading);
  window.setTimeout(finishLoading, 4200);
}

init();
