/* Reveal on scroll. Progressive: without this file, or without
   IntersectionObserver, every .reveal element stays visible. */
(function () {
  "use strict";
  if (!("IntersectionObserver" in window)) return;

  var STAGGER_MS = 50;
  var MAX_STEPS = 8;
  var root = document.documentElement;
  root.classList.add("js");

  function start() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        // One batch = elements that crossed in together. Stagger them in DOM order.
        var visible = entries
          .filter(function (entry) { return entry.isIntersecting; })
          .sort(function (a, b) {
            return a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
          });

        visible.forEach(function (entry, index) {
          var el = entry.target;
          el.style.transitionDelay = Math.min(index, MAX_STEPS) * STAGGER_MS + "ms";
          el.classList.add("is-in");
          observer.unobserve(el);
          // Drop the delay once the reveal ends so later state changes stay instant.
          el.addEventListener("transitionend", function clear(event) {
            if (event.target !== el) return;
            el.style.transitionDelay = "";
            el.removeEventListener("transitionend", clear);
          });
        });
      },
      { threshold: 0.1 }
    );

    items.forEach(function (el) { observer.observe(el); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
