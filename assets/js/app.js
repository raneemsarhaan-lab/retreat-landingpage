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
