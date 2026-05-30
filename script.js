// ===================== LOADING SCREEN =====================
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    initAnimations();
  }, 2200);
});
document.body.style.overflow = 'hidden';

// ===================== CUSTOM CURSOR =====================
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top = my + 'px';
});

function animateCursor() {
  cx += (mx - cx) * 0.15;
  cy += (my - cy) * 0.15;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a,button,.btn,.skill-card,.cert-card,.project-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%,-50%) scale(1.8)');
  el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
});

// ===================== PARTICLES =====================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - .5) * .5;
    this.vy = (Math.random() - .5) * .5;
    this.size = Math.random() * 2 + .5;
    this.alpha = Math.random() * .5 + .1;
    this.color = Math.random() > .5 ? '0,212,255' : '124,58,237';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.strokeStyle = `rgba(0,212,255,${.1 * (1 - dist / 100)})`;
        ctx.lineWidth = .5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===================== TYPING ANIMATION =====================
const titles = ['Data Science Student', 'AI/ML Developer', 'NLP Enthusiast', 'Full Stack Learner', 'Problem Solver'];
let ti = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-text');

function typeWriter() {
  const current = titles[ti];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ci + 1);
    ci++;
    if (ci === current.length) { deleting = true; setTimeout(typeWriter, 1800); return; }
  } else {
    typedEl.textContent = current.slice(0, ci - 1);
    ci--;
    if (ci === 0) { deleting = false; ti = (ti + 1) % titles.length; }
  }
  setTimeout(typeWriter, deleting ? 60 : 90);
}
typeWriter();

// ===================== NAVBAR =====================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateScrollProgress();
  updateActiveNav();
  updateBackToTop();
});

function updateActiveNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) current = s.id;
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === '#' + current);
  });
}

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinks.forEach(l => l.addEventListener('click', () => navLinksContainer.classList.remove('open')));

// ===================== SCROLL PROGRESS =====================
const progressBar = document.getElementById('scroll-progress');
function updateScrollProgress() {
  const max = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / max * 100) + '%';
}

// ===================== SCROLL ANIMATIONS =====================
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: .1 });
reveals.forEach(r => revealObserver.observe(r));

// ===================== COUNTER ANIMATION =====================
function animateCounter(el) {
  const target = +el.dataset.target;
  let count = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    count += step;
    if (count >= target) { el.textContent = target + '+'; clearInterval(interval); }
    else el.textContent = count;
  }, 40);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statObserver.unobserve(e.target);
    }
  });
}, { threshold: .3 });
document.querySelectorAll('.about-stats').forEach(s => statObserver.observe(s));

// ===================== SKILL BARS =====================
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: .2 });
document.querySelectorAll('.skills-content').forEach(s => skillObserver.observe(s));

// ===================== SKILLS TABS =====================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + btn.dataset.tab);
    panel.classList.add('active');
    // Animate skill bars when tab opens
    panel.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 100);
    });
  });
});
// Init first tab bars
setTimeout(() => {
  document.querySelectorAll('#tab-programming .skill-fill').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
}, 2500);

// ===================== PROJECT FILTER =====================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn .4s ease';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===================== DARK/LIGHT TOGGLE =====================
const themeBtn = document.getElementById('theme-toggle');
const root = document.documentElement;
// Initialize based on HTML `data-theme` (we set default to light in index.html)
let dark = root.getAttribute('data-theme') === 'dark';
// Set initial button icon and body class
if (themeBtn) {
  themeBtn.innerHTML = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}
document.body.classList.toggle('light', !dark);
themeBtn.addEventListener('click', () => {
  dark = !dark;
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeBtn.innerHTML = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
  document.body.classList.toggle('light', !dark);
});

// ===================== BACK TO TOP =====================
const btt = document.getElementById('back-to-top');
function updateBackToTop() {
  btt.classList.toggle('visible', window.scrollY > 500);
}
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===================== CONTACT FORM =====================
document.getElementById('contact-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const msg = document.getElementById('form-msg');

  // Read Formspree endpoint from the form's data attribute.
  // If you don't want to use Formspree, leave the placeholder and the script will open your email client as a fallback.
  const contactFormEl = document.getElementById('contact-form');
  const FORMSPREE_URL = (contactFormEl && contactFormEl.dataset.formspree) ? contactFormEl.dataset.formspree.trim() : '';

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  msg.textContent = '';

  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
  };

  try {
    if (!FORMSPREE_URL || FORMSPREE_URL.includes('YOUR_FORM_ID')) {
      // Fallback: open user's email client with prefilled message
      const subject = encodeURIComponent(data.subject || 'Contact from portfolio');
      const bodyLines = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Subject: ${data.subject}`,
        '',
        data.message || ''
      ];
      const body = encodeURIComponent(bodyLines.join('\n'));
      // Use your email address here (recipient)
      const mailto = `mailto:prasiddh99@gmail.com?subject=${subject}&body=${body}`;
      showToast('Opening your email client...');
      // small delay to show toast before redirect
      setTimeout(() => { window.location.href = mailto; }, 600);
      msg.innerHTML = '<span style="color:#f59e0b;font-size:.9rem">Opened your email client. Please send the email to complete.</span>';
      form.reset();
    } else {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast('✅ Message sent! I will reply soon.');
        // clear inline message area (using toast for user feedback)
        msg.textContent = '';
        form.reset();
      } else {
        throw new Error('Failed');
      }
    }
  } catch (err) {
    console.error('Contact form error:', err);
    msg.innerHTML = '<span style="color:#f87171;font-size:.9rem">❌ Failed. Email directly: prasiddh99@gmail.com</span>';
    showToast('❌ Could not send. Try emailing directly!');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  }
});

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ===================== SMOOTH SCROLL =====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===================== PROJECT CARD TILT =====================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateY(${x / 20}deg) rotateX(${-y / 20}deg) translateY(-5px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===================== INIT =====================
function initAnimations() {
  reveals.forEach(r => revealObserver.observe(r));
}

console.log('%c Prasiddh Prajapati Portfolio', 'color:#00d4ff;font-size:1.5rem;font-weight:bold;');
console.log('%c Built with pure HTML, CSS & JavaScript 🚀', 'color:#7c3aed;font-size:1rem;');

// ===================== RESUME PREVIEW =====================
const previewBtn = document.getElementById('preview-resume-btn');
const previewOverlay = document.getElementById('resume-preview');
const previewClose = document.getElementById('resume-preview-close');
const resumeIframe = document.getElementById('resume-iframe');

function openResumePreview() {
  if (!previewOverlay) return;
  // set src to ensure fresh load and URL encoding
  const src = encodeURI('resume.pdf');
  resumeIframe.src = src;
  previewOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeResumePreview() {
  if (!previewOverlay) return;
  previewOverlay.setAttribute('aria-hidden', 'true');
  // stop PDF load
  resumeIframe.src = 'about:blank';
  document.body.style.overflow = '';
}

if (previewBtn && previewOverlay && previewClose && resumeIframe) {
  previewBtn.addEventListener('click', openResumePreview);
  previewClose.addEventListener('click', closeResumePreview);
  // close when clicking backdrop
  previewOverlay.querySelector('.resume-preview-backdrop').addEventListener('click', closeResumePreview);
  // close on ESC
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeResumePreview(); });
}
