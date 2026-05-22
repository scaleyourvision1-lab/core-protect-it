// ===== Nav scroll =====
const header = document.getElementById('header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ===== Mobile nav =====
const burger   = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
if (burger && mobileNav) {
  burger.addEventListener('click', () => mobileNav.classList.toggle('open'));
  mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileNav.classList.remove('open'))
  );
}

// ===== Reveal on scroll =====
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const ro = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => ro.observe(el));
}

// ===== Animated counters =====
function countUp(el) {
  const target   = parseInt(el.dataset.target, 10);
  const prefix   = el.dataset.prefix || '';
  const suffix   = el.dataset.suffix || '';
  const duration = 1800;
  const start    = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(eased * target).toLocaleString('de-DE') + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statNums = document.querySelectorAll('.stat-num[data-target]');
if (statNums.length) {
  const so = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); so.unobserve(e.target); } });
  }, { threshold: 0.5 });
  statNums.forEach(el => so.observe(el));
}

// ===== Live scan counter flicker =====
const scanEl = document.getElementById('scanCount');
if (scanEl) {
  setInterval(() => {
    const base = 14832;
    const jitter = Math.floor(Math.random() * 40) - 20;
    scanEl.textContent = (base + jitter).toLocaleString('de-DE');
  }, 2000);
}

// ===== YouTube hero background (loop 0:01 – 0:08) =====
var ytPlayer;
var YT_START = 1, YT_END = 8;
window.onYouTubeIframeAPIReady = function() {
  if (!document.getElementById('yt-bg')) return;
  ytPlayer = new YT.Player('yt-bg', {
    videoId: 'xhulhRiYiQw',
    playerVars: {
      autoplay: 1, mute: 1, controls: 0, disablekb: 1,
      fs: 0, iv_load_policy: 3, modestbranding: 1,
      playsinline: 1, rel: 0,
      start: YT_START, end: YT_END,
      loop: 1, playlist: 'xhulhRiYiQw'
    },
    events: {
      onReady: function(e) { e.target.playVideo(); },
      onStateChange: function(e) {
        if (e.data === YT.PlayerState.ENDED) {
          ytPlayer.seekTo(YT_START); ytPlayer.playVideo();
        }
      }
    }
  });
  // Fallback poll to enforce loop bounds
  setInterval(function() {
    if (ytPlayer && ytPlayer.getCurrentTime) {
      var t = ytPlayer.getCurrentTime();
      if (t >= YT_END) { ytPlayer.seekTo(YT_START); }
    }
  }, 300);
};

// ===== Mouse glow on cards =====
document.querySelectorAll('.pillar, .card, .partner-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
  });
});
