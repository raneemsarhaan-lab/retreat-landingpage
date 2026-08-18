/* ---------------------------------------------------------------------------
   The Strategy Retreat 2026 — page behaviour
   Replaces the artboards' DCLogic component: pillar tabs and the FAQ accordion,
   plus graceful degradation for assets that have not been delivered yet.
--------------------------------------------------------------------------- */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* --- Knowledge pillar tabs ---------------------------------------------- */
  var PILLARS = [
    { num: '01', title: 'Strategy Knowledge',        desc: 'Frameworks and mental models practitioners can apply directly to their own business challenges.' },
    { num: '02', title: 'Business Case Studies',     desc: 'How organizations across industries make choices, execute, and adapt.' },
    { num: '03', title: 'Leadership Awareness',      desc: 'How mindset drives strategy — awareness and accountability behind decisions.' },
    { num: '04', title: 'Strategic Essential Skills', desc: 'Alignment, communication, decision-making, and leadership in action.' }
  ];

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var panel = document.getElementById('pillar-panel');

  if (tabs.length && panel) {
    var numEl = panel.querySelector('[data-pillar-num]');
    var titleEl = panel.querySelector('[data-pillar-title]');
    var descEl = panel.querySelector('[data-pillar-desc]');
    var media = Array.prototype.slice.call(panel.querySelectorAll('[data-pillar-media]'));

    var selectPillar = function (index, focus) {
      var pillar = PILLARS[index];
      if (!pillar) return;

      tabs.forEach(function (tab, i) {
        var active = i === index;
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
        tab.tabIndex = active ? 0 : -1;
      });

      media.forEach(function (el, i) { el.hidden = i !== index; });

      numEl.textContent = pillar.num;
      titleEl.textContent = pillar.title;
      descEl.textContent = pillar.desc;
      panel.setAttribute('aria-labelledby', 'tab-' + index);

      if (focus) tabs[index].focus();
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectPillar(i, false); });
      tab.addEventListener('keydown', function (event) {
        var last = tabs.length - 1;
        var next = null;
        switch (event.key) {
          case 'ArrowRight': case 'ArrowDown': next = i === last ? 0 : i + 1; break;
          case 'ArrowLeft':  case 'ArrowUp':   next = i === 0 ? last : i - 1; break;
          case 'Home':       next = 0; break;
          case 'End':        next = last; break;
          default: return;
        }
        event.preventDefault();
        selectPillar(next, true);
      });
    });

    selectPillar(0, false);
  }

  /* --- FAQ accordion ------------------------------------------------------ */
  var questions = Array.prototype.slice.call(document.querySelectorAll('.faq__q'));

  questions.forEach(function (question) {
    var answer = document.getElementById(question.getAttribute('aria-controls'));
    var sign = question.querySelector('.faq__sign');
    if (!answer) return;

    question.addEventListener('click', function () {
      var willOpen = question.getAttribute('aria-expanded') !== 'true';

      // One panel at a time, matching the artboards' single-index state.
      questions.forEach(function (other) {
        var otherAnswer = document.getElementById(other.getAttribute('aria-controls'));
        var otherSign = other.querySelector('.faq__sign');
        other.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.hidden = true;
        if (otherSign) otherSign.textContent = '+';
      });

      if (willOpen) {
        question.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
        if (sign) sign.textContent = '−';
      }
    });
  });

  /* --- Experience: folded tabs on mobile -----------------------------------
     The heading row only becomes a control below 900px, so the role and its
     keyboard handling are applied and withdrawn with the breakpoint rather
     than shipped as a button that does nothing on desktop.                   */
  var foldable = window.matchMedia('(max-width: 899px)');
  var expCards = Array.prototype.slice.call(document.querySelectorAll('[data-exp]'));

  if (expCards.length) {
    var setOpen = function (card, open) {
      var head = card.querySelector('.exp-card__head');
      var sign = card.querySelector('.exp-card__sign');
      card.classList.toggle('is-open', open);
      card.classList.toggle('is-folded', !open);
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (sign) sign.textContent = open ? '−' : '+';
    };

    var openOnly = function (target) {
      expCards.forEach(function (card) { setOpen(card, card === target); });
    };

    var onActivate = function (card) {
      return function () { openOnly(card.classList.contains('is-open') ? null : card); };
    };

    var applyFolding = function () {
      expCards.forEach(function (card, i) {
        var head = card.querySelector('.exp-card__head');
        if (foldable.matches) {
          head.setAttribute('role', 'button');
          head.setAttribute('tabindex', '0');
          setOpen(card, i === 0);
        } else {
          head.removeAttribute('role');
          head.removeAttribute('tabindex');
          head.removeAttribute('aria-expanded');
          card.classList.remove('is-open', 'is-folded');
        }
      });
    };

    expCards.forEach(function (card) {
      var head = card.querySelector('.exp-card__head');
      var activate = onActivate(card);
      head.addEventListener('click', function () { if (foldable.matches) activate(); });
      head.addEventListener('keydown', function (event) {
        if (!foldable.matches) return;
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault();
          activate();
        }
      });
    });

    applyFolding();
    if (foldable.addEventListener) foldable.addEventListener('change', applyFolding);
    else if (foldable.addListener) foldable.addListener(applyFolding);
  }

  /* --- Leaders rail dots ---------------------------------------------------
     The rail only scrolls when the cards outrun their container — wide desktop
     fits all four — so the dots appear only when there is something to scroll. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-dots]'), function (dots) {
    var rail = dots.parentNode.querySelector('.scroller');
    if (!rail) return;
    var cards = Array.prototype.slice.call(rail.children);
    var buttons = Array.prototype.slice.call(dots.querySelectorAll('.dot'));
    if (!cards.length || buttons.length !== cards.length) return;

    var origin = function () { return cards[0].offsetLeft; };

    var nearest = function () {
      var x = rail.scrollLeft + origin();
      var best = 0, gap = Infinity;
      cards.forEach(function (card, i) {
        var d = Math.abs(card.offsetLeft - x);
        if (d < gap) { gap = d; best = i; }
      });
      return best;
    };

    var mark = function () {
      var current = nearest();
      buttons.forEach(function (b, i) {
        if (i === current) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
    };

    var sync = function () {
      var scrolls = rail.scrollWidth > rail.clientWidth + 1;
      dots.hidden = !scrolls;
      if (scrolls) mark();
    };

    buttons.forEach(function (button, i) {
      button.addEventListener('click', function () {
        rail.scrollTo({
          left: cards[i].offsetLeft - origin(),
          behavior: reduceMotion.matches ? 'auto' : 'smooth'
        });
      });
    });

    var tick;
    rail.addEventListener('scroll', function () {
      clearTimeout(tick);
      tick = setTimeout(mark, 120);
    });
    window.addEventListener('resize', sync);
    sync();
  });

  /* --- Venue carousel ------------------------------------------------------
     Buttons move the scroll position; the scroll listener is the single source
     of truth, so swiping and clicking stay consistent.                       */
  Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (carousel) {
    var track = carousel.querySelector('.carousel__track');
    var status = carousel.querySelector('[data-carousel-status]');
    var slides = track ? track.children.length : 0;
    if (!track || slides < 2) return;

    var indexOfCurrent = function () {
      return Math.round(track.scrollLeft / track.clientWidth);
    };

    var go = function (step) {
      var next = (indexOfCurrent() + step + slides) % slides;
      track.scrollTo({ left: next * track.clientWidth, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    };

    carousel.querySelector('[data-carousel-prev]').addEventListener('click', function () { go(-1); });
    carousel.querySelector('[data-carousel-next]').addEventListener('click', function () { go(1); });

    var tick;
    track.addEventListener('scroll', function () {
      clearTimeout(tick);
      tick = setTimeout(function () {
        if (status) status.textContent = 'Photo ' + (indexOfCurrent() + 1) + ' of ' + slides;
      }, 120);
    });
  });

  /* --- Missing assets -----------------------------------------------------
     Photography, logos and three of the six clips were not delivered with the
     design (see assets/README.md). Rather than render broken-image glyphs, drop
     the element and let the styled well or the alt text stand in.            */
  var textFallback = function (img) {
    if (!img.parentNode) return;
    var span = document.createElement('span');
    span.className = 'logo-fallback';
    span.textContent = img.getAttribute('alt') || '';
    img.parentNode.replaceChild(span, img);
  };

  Array.prototype.forEach.call(document.querySelectorAll('img[data-fallback]'), function (img) {
    var handled = false;
    var handle = function () {
      if (handled) return;
      handled = true;
      var well = img.closest('.media');
      if (well) well.setAttribute('data-asset-missing', 'true');
      if (img.matches('.brand-mark, .partners__wall img, .footer__brand img')) {
        textFallback(img);
      } else {
        img.style.display = 'none';
      }
    };
    img.addEventListener('error', handle);
    if (img.complete && img.naturalWidth === 0) handle();
  });

  Array.prototype.forEach.call(document.querySelectorAll('video[data-ambient]'), function (video) {
    var drop = function () { video.style.display = 'none'; };
    video.addEventListener('error', drop, true);
    // The element may already have failed before this script ran.
    if (video.error) drop();

    // Ambient motion is decoration; honour the OS-level preference both ways.
    var applyMotionPreference = function () {
      if (reduceMotion.matches) {
        video.removeAttribute('autoplay');
        video.pause();
      } else if (video.paused) {
        var attempt = video.play();
        if (attempt && attempt.catch) attempt.catch(function () { /* autoplay blocked */ });
      }
    };

    applyMotionPreference();
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener('change', applyMotionPreference);
    } else if (reduceMotion.addListener) {
      reduceMotion.addListener(applyMotionPreference);
    }
  });
}());
