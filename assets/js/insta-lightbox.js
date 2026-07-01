// Minimal lightbox for Instagram-style gallery
(function () {
  "use strict";

  var overlay = null;
  var currentIndex = 0;
  var currentItems = [];

  function openLightbox(index, items) {
    currentItems = items;
    currentIndex = index;
    renderImage();
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "insta-lightbox";
      overlay.style.cssText =
        "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s";
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) closeLightbox();
      });

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
        "max-width:90vw;max-height:90vh;object-fit:contain;border-radius:4px;box-shadow:0 4px 30px rgba(0,0,0,0.5)";
      overlay.appendChild(img);

      document.body.appendChild(overlay);
      // Force reflow then fade in
      requestAnimationFrame(function () {
        overlay.style.opacity = "1";
      });
    }

    document.addEventListener("keydown", onKeydown);
  }

  function renderImage() {
    var img = document.getElementById("insta-lightbox-img");
    if (img && currentItems.length > 0) {
      img.src = currentItems[currentIndex].href;
      img.alt = "";
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
