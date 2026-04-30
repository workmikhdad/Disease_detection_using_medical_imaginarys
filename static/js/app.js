// ═══════════════════════════════════════
// HEALTHCURE AI — APP.JS
// ═══════════════════════════════════════

/* CUSTOM CURSOR */
const initCursor = () => {
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(cursor, ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  const lerp = (a, b, t) => a + (b - a) * t;
  const animRing = () => {
    rx = lerp(rx, mx, 0.15);
    ry = lerp(ry, my, 0.15);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  };
  animRing();

  document.querySelectorAll('a, button, .glass-card, .disease-card, input, select, label').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '16px'; cursor.style.height = '16px';
      ring.style.width = '50px'; ring.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px'; cursor.style.height = '10px';
      ring.style.width = '36px'; ring.style.height = '36px';
    });
  });
};

/* SCROLL REVEAL */
const initReveal = () => {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => io.observe(el));
  // immediate pass
  els.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight - 60) el.classList.add('visible');
  });
};

/* NAVBAR SCROLL STATE */
const initNavbar = () => {
  const nav = document.querySelector('.glass-nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', update, { passive: true });
  update();
};

/* UPLOAD PREVIEW */
const initUpload = () => {
  const fileInput = document.querySelector('#file');
  const preview   = document.querySelector('#uploadPreview');
  if (!fileInput || !preview) return;

  // Drag & drop
  preview.addEventListener('dragover', e => { e.preventDefault(); preview.classList.add('drag-over'); });
  preview.addEventListener('dragleave', () => preview.classList.remove('drag-over'));
  preview.addEventListener('drop', e => {
    e.preventDefault(); preview.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) showPreview(file);
  });

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) { preview.innerHTML = previewPlaceholder(); return; }
    if (!file.type.startsWith('image/')) {
      preview.innerHTML = `<div style="color:var(--rose);font-size:0.85rem;">⚠ Not a valid image file</div>`;
      return;
    }
    showPreview(file);
  });

  function showPreview(file) {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.style.cssText = 'max-width:100%;max-height:220px;object-fit:contain;border-radius:12px;animation:badge-pop 0.4s ease both;';
    img.onload = () => URL.revokeObjectURL(img.src);
    preview.innerHTML = '';
    preview.appendChild(img);
  }
};

function previewPlaceholder() {
  return `<div class="upload-icon">⬆</div><span style="font-size:0.85rem;">Drop image here or click Browse</span>`;
}

/* FLOATING PARTICLES */
const initParticles = () => {
  const canvas = document.querySelector('.bg-canvas');
  if (!canvas) return;
  const colors = ['#38bdf8','#a78bfa','#34d399'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 2 + 1;
    const dur  = Math.random() * 18 + 14;
    const delay= Math.random() * -20;
    const left = Math.random() * 100;
    const drift= (Math.random() - 0.5) * 120;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${left}%;bottom:-10px;
      background:${colors[Math.floor(Math.random()*3)]};
      animation-duration:${dur}s;
      animation-delay:${delay}s;
      --drift:${drift}px;
    `;
    canvas.appendChild(p);
  }
};

/* COUNTER ANIMATION */
const initCounters = () => {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let current = 0;
    const step = Math.ceil(target / 60);
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const tick = () => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString() + suffix;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
    }, { threshold: 0.5 });
    io.observe(el);
  });
};

/* FORM SUBMIT LOADING STATE */
const initFormLoading = () => {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      const btn = form.querySelector('[type=submit]');
      if (!btn) return;
      btn.disabled = true;
      btn.innerHTML = `<span class="scan-spinner" style="width:18px;height:18px;margin:0;display:inline-block;vertical-align:middle;"></span> Analyzing…`;
    });
  });
};

/* GLITCH TEXT EFFECT (hero title) */
const initGlitch = () => {
  const el = document.querySelector('.glitch');
  if (!el) return;
  const orig = el.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let frame = 0;
  const interval = setInterval(() => {
    el.textContent = orig.split('').map((ch, i) => {
      if (ch === ' ') return ' ';
      if (i < frame) return orig[i];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    frame++;
    if (frame > orig.length) { el.textContent = orig; clearInterval(interval); }
  }, 40);
};

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth > 768) initCursor();
  initReveal();
  initNavbar();
  initUpload();
  initParticles();
  initCounters();
  initFormLoading();
  setTimeout(initGlitch, 800);
});
