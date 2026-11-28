/* ============================================================
   AfroCure Arts and Talent Centre
   script.js — Shared behaviour
   UPDATED: Added Community Service image fit enforcement
============================================================ */
(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. Sticky Navigation & Mobile Menu
  ---------------------------------------------------------- */
  var nav = document.getElementById('siteNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  var burger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('active', isOpen);
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    Array.prototype.forEach.call(mobileNav.querySelectorAll('a'), function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     2. Reveal on Scroll
  ---------------------------------------------------------- */
  var revealItems = document.querySelectorAll('.reveal');
  if (revealItems.length) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      Array.prototype.forEach.call(revealItems, function (item) {
        revealObserver.observe(item);
      });
    } else {
      Array.prototype.forEach.call(revealItems, function (item) {
        item.classList.add('visible');
      });
    }
  }

  /* ----------------------------------------------------------
     3. Back to Top
  ---------------------------------------------------------- */
  var toTop = document.getElementById('backToTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----------------------------------------------------------
     4. Number Counters
  ---------------------------------------------------------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-count'), 10) || 0;
          var duration = 1600;
          var startTime = null;

          function step(timestamp) {
            if (startTime === null) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              el.textContent = target.toLocaleString();
            }
          }
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        });
      }, { threshold: 0.5 });

      Array.prototype.forEach.call(counters, function (counter) {
        counterObserver.observe(counter);
      });
    }
  }

  /* ----------------------------------------------------------
     5. Gallery Modal
  ---------------------------------------------------------- */
  var galleryItems = document.querySelectorAll('.gallery-item');
  var galleryModal = document.getElementById('galleryModal');
  if (galleryItems.length && galleryModal) {
    var currentIndex = 0;
    var totalItems = galleryItems.length;
    var modalImage = document.getElementById('modalImage');
    var indexEl = galleryModal.querySelector('.gallery-index');

    function pad(number) { return number < 10 ? '0' + number : String(number); }

    function renderGallery() {
      var item = galleryItems[currentIndex];
      var img = item.querySelector('img');
      if (img && modalImage) {
        modalImage.src = img.src;
        modalImage.alt = img.alt;
      }
      if (indexEl) {
        indexEl.textContent = pad(currentIndex + 1) + ' / ' + pad(totalItems);
      }
    }

    function openGallery(index) {
      currentIndex = index;
      renderGallery();
      galleryModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
      galleryModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    function moveGallery(direction) {
      currentIndex = (currentIndex + direction + totalItems) % totalItems;
      renderGallery();
    }

    Array.prototype.forEach.call(galleryItems, function (item, index) {
      item.addEventListener('click', function () { openGallery(index); });
    });

    var prevBtn = galleryModal.querySelector('.gallery-prev');
    var nextBtn = galleryModal.querySelector('.gallery-next');
    var closeBtn = galleryModal.querySelector('.gallery-close');

    if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); moveGallery(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); moveGallery(1); });
    if (closeBtn) closeBtn.addEventListener('click', closeGallery);

    galleryModal.addEventListener('click', function (event) {
      if (event.target === galleryModal) closeGallery();
    });

    document.addEventListener('keydown', function (event) {
      if (!galleryModal.classList.contains('open')) return;
      if (event.key === 'Escape') closeGallery();
      if (event.key === 'ArrowLeft') moveGallery(-1);
      if (event.key === 'ArrowRight') moveGallery(1);
    });
  }

  /* ----------------------------------------------------------
     6. Community Service — Ensure images fit placeholders
     Forces object-fit: contain so photos are always fully
     visible with no cropping or zooming on any device.
  ---------------------------------------------------------- */
  var communityImgs = document.querySelectorAll('.community-img-placeholder img');
  if (communityImgs.length) {
    Array.prototype.forEach.call(communityImgs, function (img) {
      img.style.objectFit = 'contain';
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.maxHeight = '400px';
      img.style.display = 'block';
      /* If image fails to load, hide it gracefully */
      img.addEventListener('error', function () {
        this.style.display = 'none';
      });
    });
  }

  /* ----------------------------------------------------------
     7. Contact Form Simulation
  ---------------------------------------------------------- */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var button = contactForm.querySelector('button[type="submit"]');
      var originalText = button.textContent;
      button.textContent = 'Message sent';
      button.disabled = true;

      setTimeout(function () {
        button.textContent = originalText;
        button.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  /* ----------------------------------------------------------
     8. WhatsApp Floating Button
  ---------------------------------------------------------- */
  var waNumber = '254715788117';
  var waMessage = encodeURIComponent('Hello AfroCure Arts and Talent Centre, I would like to get in touch.');
  var waLink = 'https://wa.me/' + waNumber + '?text=' + waMessage;
  var waBtn = document.createElement('a');
  waBtn.href = waLink;
  waBtn.className = 'whatsapp-float';
  waBtn.target = '_blank';
  waBtn.rel = 'noopener noreferrer';
  waBtn.setAttribute('aria-label', 'Chat on WhatsApp');
  waBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  document.body.appendChild(waBtn);
})();