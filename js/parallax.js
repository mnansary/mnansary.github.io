/*!
 * Lightweight scroll parallax (mobile-friendly replacement for parallax.js).
 * For every [data-parallax="scroll"][data-image-src] element a background layer
 * is injected and translated with requestAnimationFrame as the page scrolls.
 * Uses passive listeners so it also runs while touch-panning on mobile browsers.
 */
(function () {
  'use strict';

  var instances = [];
  var ticking = false;

  function setup() {
    var els = document.querySelectorAll('[data-parallax="scroll"]');
    Array.prototype.forEach.call(els, function (el) {
      var src = el.getAttribute('data-image-src');
      if (!src || el.querySelector('.parallax-layer')) return;
      var layer = document.createElement('div');
      layer.className = 'parallax-layer';
      layer.style.backgroundImage = 'url("' + src + '")';
      el.insertBefore(layer, el.firstChild);
      instances.push({ el: el, layer: layer });
    });
    update();
  }

  function update() {
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < instances.length; i++) {
      var item = instances[i];
      var rect = item.el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) continue;
      var winH = rect.height;
      // layer CSS is 160% height positioned at -30%, so it has 60% slack to move in
      var extra = winH * 0.6;
      var progress = (vh - rect.top) / (vh + winH);
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      var y = extra / 2 - progress * extra;
      item.layer.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', onScroll);
})();
