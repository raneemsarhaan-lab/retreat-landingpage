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

  /* --- Click-to-play films ------------------------------------------------
     The reference calls for a play affordance rather than ambient looping, so
     these start muted and paused, and play with sound on click. One at a time. */
  var players = Array.prototype.slice.call(document.querySelectorAll('.vplayer'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('.vplay');
    if (!video || !button) return;

    var stop = function () {
      video.pause();
      video.muted = true;
      player.classList.remove('is-playing');
    };

    button.addEventListener('click', function () {
      players.forEach(function (other) {
        if (other !== player) {
          var v = other.querySelector('video');
          if (v) { v.pause(); v.muted = true; }
          other.classList.remove('is-playing');
        }
      });
      video.muted = false;
      player.classList.add('is-playing');
      var attempt = video.play();
      if (attempt && attempt.catch) attempt.catch(function () { stop(); });
    });

    video.addEventListener('ended', stop);
    video.addEventListener('error', function () { button.hidden = true; });
    // Clicking the film itself pauses and restores the caption.
    video.addEventListener('click', function () { if (!video.paused) stop(); });
  });

  /* --- Leaders rail dots ---------------------------------------------------
     The rail only scrolls when the cards outrun their container — wide desktop
     fits all four — so the dots appear only when there is something to scroll. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-dots]'), function (dots) {
    var rail = dots.parentNode.querySelector('.scroller');
    if (!rail) return;
    var cards = Array.prototype.slice.call(rail.children);
    var buttons = Array.prototype.slice.call(dots.querySelectorAll('.dot'));

    // An empty container generates one dot per card, so adding films to the
    // rail keeps the dots in step without touching the markup.
    if (!buttons.length && cards.length) {
      var label = dots.getAttribute('data-dots-label') || 'Go to item';
      cards.forEach(function (card, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot';
        dot.setAttribute('aria-label', label + ' ' + (i + 1));
        dots.appendChild(dot);
      });
      buttons = Array.prototype.slice.call(dots.querySelectorAll('.dot'));
    }

    if (!cards.length || buttons.length !== cards.length) return;
    dots.hidden = false;

    // Map dots onto scroll *progress*, not card offsets. A rail whose overflow
    // is smaller than its trailing cards can never bring those cards to the
    // left edge, which left the last dots permanently unreachable.
    var travel = function () { return rail.scrollWidth - rail.clientWidth; };
    var lastIndex = buttons.length - 1;

    var currentIndex = function () {
      var max = travel();
      if (max <= 1) return 0;
      return Math.round((rail.scrollLeft / max) * lastIndex);
    };

    var mark = function () {
      var current = currentIndex();
      buttons.forEach(function (b, i) {
        if (i === current) b.setAttribute('aria-current', 'true');
        else b.removeAttribute('aria-current');
      });
    };

    buttons.forEach(function (button, i) {
      button.addEventListener('click', function () {
        var max = travel();
        if (max <= 1) return;
        rail.scrollTo({
          left: (i / lastIndex) * max,
          behavior: reduceMotion.matches ? 'auto' : 'smooth'
        });
      });
    });

    var tick;
    rail.addEventListener('scroll', function () {
      clearTimeout(tick);
      tick = setTimeout(mark, 120);
    });
    window.addEventListener('resize', mark);
    mark();
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
