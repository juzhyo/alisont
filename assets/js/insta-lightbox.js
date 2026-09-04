// Lightbox for Instagram-style gallery with mobile pinch-zoom support
(function () {
  "use strict";

  var overlay = null;
  var currentIndex = 0;
  var currentItems = [];

  // Touch / zoom state
  var zoom = 1;
  var minZoom = 1;
  var maxZoom = 5;
  var pinchStartDist = 0;
  var pinchStartZoom = 1;
  var activeTouches = 0;
  var suppressClickUntil = 0; // avoid the synthesized click after a pinch

  function openLightbox(index, items) {
    currentItems = items;
    currentIndex = index;
    zoom = 1;
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "insta-lightbox";
      overlay.style.cssText =
        "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;touch-action:none;overflow:hidden;";

      var wrap = document.createElement("div");
      wrap.id = "insta-lightbox-wrap";
      wrap.style.cssText =
        "position:relative;max-width:90vw;max-height:90vh;display:flex;align-items:center;justify-content:center;";

      var closeBtn = document.createElement("button");
      closeBtn.innerHTML = "&times;";
      closeBtn.style.cssText =
        "position:absolute;top:16px;right:20px;background:none;border:none;color:#fff;font-size:40px;cursor:pointer;line-height:1;z-index:10";
      closeBtn.addEventListener("click", closeLightbox);
      overlay.appendChild(closeBtn);

      var prevBtn = document.createElement("button");
      prevBtn.innerHTML =
        '<svg viewBox="0 0 24 24" width="32" height="32" fill="white"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
      prevBtn.style.cssText =
        "position:absolute;left:16px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.1);border:none;border-radius:50%;width:48px;height:48px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10";
      prevBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        navigate(-1);
      });
      overlay.appendChild(prevBtn);

      var nextBtn = document.createElement("button");
      nextBtn.innerHTML =
        '<svg viewBox="0 0 24 24" width="32" height="32" fill="white"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>';
      nextBtn.style.cssText =
        "position:absolute;right:16px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.1);border:none;border-radius:50%;width:48px;height:48px;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:10";
      nextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        navigate(1);
      });
      overlay.appendChild(nextBtn);

      var img = document.createElement("img");
      img.id = "insta-lightbox-img";
      img.style.cssText =
        "max-width:100%;max-height:100%;object-fit:contain;border-radius:4px;box-shadow:0 4px 30px rgba(0,0,0,0.5);user-select:none;-webkit-user-drag:none;touch-action:none;transform-origin:center center;will-change:transform;";
      wrap.appendChild(img);

      overlay.appendChild(wrap);

      // Close only on genuine tap of the backdrop (or a plain click on desktop).
      // A pinch gesture fires a synthesized click afterwards — suppress it.
      overlay.addEventListener("click", function (e) {
        if (Date.now() < suppressClickUntil) return;
        if (e.target === overlay) closeLightbox();
      });

      // --- Mobile touch gestures: pinch to zoom, drag to pan, tap to close ---
      var lastTapTime = 0;

      overlay.addEventListener(
        "touchstart",
        function (e) {
          if (e.target === closeBtn || e.target === prevBtn || e.target === nextBtn)
            return;
          activeTouches = e.touches.length;
          if (activeTouches === 2) {
            pinchStartDist = distance(e.touches[0], e.touches[1]);
            pinchStartZoom = zoom;
          }
        },
        { passive: true }
      );

      overlay.addEventListener(
        "touchmove",
        function (e) {
          activeTouches = e.touches.length;
          if (activeTouches === 2) {
            e.preventDefault();
            var d = distance(e.touches[0], e.touches[1]);
            if (pinchStartDist > 0) {
              var next = clamp(pinchStartZoom * (d / pinchStartDist), minZoom, maxZoom);
              applyZoom(next);
            }
            // A real two-finger gesture: don't let the follow-up click close us.
            suppressClickUntil = Date.now() + 350;
          }
        },
        { passive: false }
      );

      overlay.addEventListener(
        "touchend",
        function (e) {
          activeTouches = e.touches.length;
          if (activeTouches === 0) {
            var now = Date.now();
            if (now < suppressClickUntil) {
              // Pinch just ended — do NOT treat as tap-close.
              return;
            }
            if (zoom > minZoom) {
              // Tapping while zoomed: return to 1x first, next tap closes.
              applyZoom(1);
              return;
            }
            // Simple tap (no pinch in the last 350ms): close.
            closeLightbox();
          }
        },
        { passive: true }
      );

      // Double-tap to zoom in / reset (nice on mobile)
      overlay.addEventListener("dblclick", function (e) {
        if (e.target === closeBtn || e.target === prevBtn || e.target === nextBtn)
          return;
        applyZoom(zoom > minZoom ? 1 : maxZoom);
      });

      document.body.appendChild(overlay);
      requestAnimationFrame(function () {
        overlay.style.opacity = "1";
      });
    }

    document.addEventListener("keydown", onKeydown);
  }

  function applyZoom(next) {
    zoom = next;
    var img = document.getElementById("insta-lightbox-img");
    if (img) img.style.transform = "scale(" + zoom + ")";
  }

  function distance(t1, t2) {
    var dx = t1.clientX - t2.clientX;
    var dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function renderImage() {
    var img = document.getElementById("insta-lightbox-img");
    if (img && currentItems.length > 0) {
      img.src = currentItems[currentIndex].href;
      img.alt = "";
      applyZoom(1); // reset zoom when switching images
    }
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + currentItems.length) % currentItems.length;
    renderImage();
  }

  function onKeydown(e) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  }

  function closeLightbox() {
    if (overlay) {
      overlay.style.opacity = "0";
      setTimeout(function () {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        overlay = null;
        currentItems = [];
        zoom = 1;
      }, 200);
    }
    document.removeEventListener("keydown", onKeydown);
  }

  // Attach click handlers to all gallery links
  document.addEventListener("click", function (e) {
    var link = e.target.closest(".insta-gallery-item");
    if (!link) return;
    e.preventDefault();
    var gallery = link.closest(".insta-gallery");
    if (!gallery) return;
    var items = gallery.querySelectorAll(".insta-gallery-item");
    var index = Array.prototype.indexOf.call(items, link);
    var itemData = Array.prototype.map.call(items, function (item) {
      return { href: item.getAttribute("href") };
    });
    openLightbox(index, itemData);
  });
})();
