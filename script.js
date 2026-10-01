/**
 * M J Enterprise - Client JavaScript
 * M J Enterprise - WhatsApp: +91 9321980075
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  });

  // 3. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
    navMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => navMenu.classList.remove('open')));
  }

  // 4. Before-After Comparison Slider
  const sliderContainer = document.getElementById('comparison-slider');
  const imgBefore = document.getElementById('img-before');
  const sliderHandle = document.getElementById('slider-handle');

  if (sliderContainer && imgBefore && sliderHandle) {
    let isDown = false;
    const fit = () => { const im = imgBefore.querySelector('img'); if (im) { im.style.width = sliderContainer.offsetWidth + 'px'; im.style.maxWidth = 'none'; } };
    fit(); addEventListener('resize', fit);

    const moveSlider = (clientX) => {
      const rect = sliderContainer.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      imgBefore.style.width = percentage + '%';
      sliderHandle.style.left = percentage + '%';
    };

    sliderContainer.addEventListener('mousedown', () => (isDown = true));
    window.addEventListener('mouseup', () => (isDown = false));
    sliderContainer.addEventListener('mousemove', (e) => {
      if (isDown) moveSlider(e.clientX);
    });

    sliderContainer.addEventListener('touchstart', () => (isDown = true));
    window.addEventListener('touchend', () => (isDown = false));
    sliderContainer.addEventListener('touchmove', (e) => {
      if (isDown && e.touches.length > 0) moveSlider(e.touches[0].clientX);
    });
  }

  // 5. Initial Quote Calculation
  updateCalc();
});

// Accordion Toggle Function
function toggleAcc(button) {
  const body = button.nextElementSibling;
  const isAlreadyOpen = body.classList.contains('show');

  // Close all open items
  document.querySelectorAll('.accordion-body').forEach((b) => b.classList.remove('show'));
  document.querySelectorAll('.accordion-header').forEach((h) => h.classList.remove('active'));

  if (!isAlreadyOpen) {
    body.classList.add('show');
    button.classList.add('active');
  }
}

// Yearly plan price + WhatsApp message
function updateCalc() {
  const plan = document.getElementById('calc-pest');
  if (!plan) return;
  const slot = document.getElementById('calc-slot');
  const price = parseInt(plan.value, 10).toLocaleString('en-IN');
  const out = document.getElementById('calc-price-val');
  if (out) out.innerText = '₹' + price;
  const wa = document.getElementById('calc-wa-action');
  if (wa) {
    const msg = `*YEARLY PEST CONTROL PLAN ENQUIRY*\nHome size: ${plan.options[plan.selectedIndex].text}\nPreferred time: ${slot ? slot.value : 'Immediate'}\nPlan price: Rs. ${price} (3 services/year)\nPlease confirm availability.`;
    wa.href = 'https://wa.me/919321980075?text=' + encodeURIComponent(msg);
  }
}

/* ===== Animations: logo intro, hero entrance, scroll effects ===== */
(() => {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intro = document.getElementById('intro');

  // Split hero title into masked lines
  const title = document.querySelector('.hero-title');
  if (title) {
    const parts = title.innerHTML.trim().split(/<br\s*\/?>|(?=<span class="gradient-text">)/i);
    title.innerHTML = parts.map((p, i) =>
      `<span class="line-mask"><span style="transition-delay:${0.15 + i * 0.12}s">${p}</span></span>`).join('');
  }

  const start = () => {
    root.classList.add('ready');
    root.classList.remove('intro-lock');
    countUp();
  };

  if (intro && !reduce) {
    root.classList.add('intro-lock');
    setTimeout(() => { intro.classList.add('done'); setTimeout(start, 350); }, 2900);
    setTimeout(() => intro.remove(), 4600);
  } else { start(); }

  // Scroll reveals with stagger
  const groups = [
    ['.section-head', 0], ['.pest-card', 1], ['.directions-grid > *', 0], ['.service-card', 1], ['.accordion-item', 1], 
    ['.calculator-card', 0], ['.comparison-slider', 0], ['.insta-card', 0]
  ];
  const targets = [];
  groups.forEach(([sel, stagger]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (sel === '.service-card' || sel === '.review-card') el.classList.add(i % 2 ? 'from-right' : 'from-left');
      if (stagger) el.style.setProperty('--d', (i % 3) * 0.12 + 's');
      targets.push(el);
    });
  });
  const io = new IntersectionObserver((es) => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  targets.forEach(t => io.observe(t));

  // Counters
  function countUp() {
    document.querySelectorAll('.stat-num').forEach(el => {
      const node = [...el.childNodes].find(n => n.nodeType === 3 && /\d/.test(n.textContent));
      if (!node) return;
      const txt = node.textContent;
      const m = txt.match(/[\d,.]+/); if (!m) return;
      const end = parseFloat(m[0].replace(/,/g, '')), dec = (m[0].split('.')[1] || '').length;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / 1600, 1), v = end * (1 - Math.pow(1 - p, 4));
        node.textContent = txt.replace(m[0], v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  // Animated anchor scrolling (runs even with reduced motion, but instantly)
  let autoScroll = false;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const links = [...document.querySelectorAll('a[href^="#"]')].filter(a => a.getAttribute('href').length > 1);
  links.forEach((a) => a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const from = scrollY, to = Math.max(0, target.getBoundingClientRect().top + from - 70);
    const dist = to - from, dur = reduce ? 0 : Math.min(1600, 700 + Math.abs(dist) * 0.25);
    const t0 = performance.now(); autoScroll = true;
    const step = (now) => {
      const p = dur ? Math.min((now - t0) / dur, 1) : 1;
      scrollTo(0, from + dist * ease(p));
      if (p < 1) requestAnimationFrame(step);
      else {
        autoScroll = false;
        target.classList.remove('flash'); void target.offsetWidth; target.classList.add('flash');
        history.pushState(null, '', a.getAttribute('href'));
      }
    };
    requestAnimationFrame(step);
  }));
  // Highlight current section in navbar
  const navLinks = [...document.querySelectorAll('.nav-menu a')];
  const spy = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(l => { const t = document.querySelector(l.getAttribute('href')); if (t) spy.observe(t); });

  if (reduce) return;

  // Scroll-driven: hero parallax + smart navbar
  const heroImg = document.querySelector('.hero-img');
  const nav = document.getElementById('navbar');
  let lastY = 0, ticking = false;
  const onScroll = () => {
    const y = scrollY;
    if (heroImg && y < 900) heroImg.style.transform = `scale(1.12) translateY(${y * 0.08}px)`;
    if (nav) {
      nav.classList.toggle('scrolled', y > 40);
      nav.classList.toggle('hide', y > lastY && y > 400 && !document.getElementById('nav-menu').classList.contains('open') && !autoScroll);
    }
    lastY = y; ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  // 3D tilt on cards (desktop pointers only)
  if (matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.service-card, .review-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.classList.add('tilting');
        card.style.transition = 'box-shadow .25s, border-color .25s';
        card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1), box-shadow .25s';
        card.style.transform = '';
      });
    });
  }
})();
