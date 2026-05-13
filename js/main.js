/* Hope Counseling & Family Therapy — Main JS */

document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav   = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      const open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
      navToggle.querySelectorAll('span').forEach((s, i) => {
        if (open) {
          if (i === 0) s.style.transform = 'rotate(45deg) translate(5px, 5px)';
          if (i === 1) s.style.opacity = '0';
          if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          s.style.transform = '';
          s.style.opacity = '';
        }
      });
    });
    // Close nav on link click
    siteNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
      });
      if (!isOpen) item.classList.add('open');
    });
  });

  // Active nav link (simple path match)
  const path = window.location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
  document.querySelectorAll('.site-nav a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href && href !== '#' && (
      href === path + '.html' ||
      href === './' + path + '.html' ||
      (path === '' || path === 'index') && (href === 'index.html' || href === './')
    )) {
      a.classList.add('active');
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Reveal-on-scroll (gentle fade-up for .reveal elements)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Mesh gradient ambient canvas — subtle, GPU-light
  const meshCanvases = document.querySelectorAll('canvas.mesh-canvas');
  if (meshCanvases.length && !prefersReducedMotion) {
    meshCanvases.forEach(function (canvas) {
      const ctx = canvas.getContext('2d');
      // Sage + terracotta palette to match the site
      const palette = [
        'rgba(107, 158, 138, 0.55)',  // sage
        'rgba(192, 126, 82, 0.40)',   // terracotta
        'rgba(232, 180, 138, 0.40)',  // light terracotta
        'rgba(43, 77, 62, 0.55)'      // forest
      ];
      const blobs = palette.map(function (c) {
        return {
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 0.35 + Math.random() * 0.25,
          color: c
        };
      });
      function resize() {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      }
      resize();
      window.addEventListener('resize', resize);
      function draw() {
        const w = canvas.width, h = canvas.height;
        ctx.fillStyle = '#2B4D3E';
        ctx.fillRect(0, 0, w, h);
        blobs.forEach(function (b) {
          b.x += b.vx / w;
          b.y += b.vy / h;
          if (b.x < -0.2 || b.x > 1.2) b.vx *= -1;
          if (b.y < -0.2 || b.y > 1.2) b.vy *= -1;
          const grd = ctx.createRadialGradient(
            b.x * w, b.y * h, 0,
            b.x * w, b.y * h, b.r * Math.max(w, h)
          );
          grd.addColorStop(0, b.color);
          grd.addColorStop(1, 'transparent');
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = grd;
          ctx.fillRect(0, 0, w, h);
          ctx.globalCompositeOperation = 'source-over';
        });
        requestAnimationFrame(draw);
      }
      draw();
    });
  }

  // Sticky stack scroll-driven activation
  const stackFeatures = document.querySelectorAll('.stack-feature');
  const stackStates = document.querySelectorAll('.stack-state');
  if (stackFeatures.length && 'IntersectionObserver' in window) {
    const stackIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const num = entry.target.dataset.feature;
          stackFeatures.forEach(function (c) { c.classList.toggle('active', c.dataset.feature === num); });
          stackStates.forEach(function (s) { s.classList.toggle('active', s.dataset.state === num); });
        }
      });
    }, { threshold: 0.55 });
    stackFeatures.forEach(function (el) { stackIO.observe(el); });
  }

});
