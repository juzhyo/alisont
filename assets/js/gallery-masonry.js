// Masonry layout for .insta-gallery grids.
//
// Distributes the existing gallery items (in DOM order — clips first, then
// photos) into the currently-shortest column, so the packed result reads
// top-to-bottom / left-to-right and rows no longer leave dead space for
// shorter images.
//
// Progressive enhancement: if this script never runs, gallery.html's CSS
// grid still renders the gallery normally.
(function () {
  "use strict";

  function columnCount() {
    // Mirrors the 2-col mobile breakpoint in gallery.html
    return window.matchMedia("(max-width: 640px)").matches ? 2 : 3;
  }

  // Cache the original items once; later layouts move them between columns.
  function collectItems(grid) {
    if (!grid._masonryItems) {
      grid._masonryItems = Array.prototype.slice.call(
        grid.querySelectorAll(".insta-gallery-item")
      );
    }
    return grid._masonryItems;
  }

  function layout(grid) {
    var items = collectItems(grid);
    if (!items.length) return;

    var cols = columnCount();

    // Detach every item, then rebuild fresh column wrappers.
    items.forEach(function (item) {
      if (item.parentNode) item.parentNode.removeChild(item);
    });
    while (grid.firstChild) grid.removeChild(grid.firstChild);

    var columns = [];
    for (var i = 0; i < cols; i++) {
      var col = document.createElement("div");
      col.className = "insta-masonry-col";
      grid.appendChild(col);
      columns.push(col);
    }
    grid.classList.add("insta-masonry");

    // Place each item into the shortest column at that moment.
    var heights = [];
    for (var h = 0; h < cols; h++) heights.push(0);

    items.forEach(function (item) {
      var target = 0;
      for (var j = 1; j < cols; j++) {
        if (heights[j] < heights[target] - 0.5) target = j;
      }
      columns[target].appendChild(item);
      heights[target] = columns[target].offsetHeight;
    });
  }

  function layoutAll() {
    var grids = document.querySelectorAll(".insta-gallery");
    Array.prototype.forEach.call(grids, layout);
  }

  // Once a clip's real dimensions are known, pin its aspect ratio so the
  // reserved box matches the footage, then re-pack.
  function bindVideos() {
    var videos = document.querySelectorAll(".insta-gallery video");
    Array.prototype.forEach.call(videos, function (video) {
      if (video._masonryBound) return;
      video._masonryBound = true;
      var sync = function () {
        if (video.videoWidth && video.videoHeight) {
          video.style.aspectRatio = video.videoWidth + " / " + video.videoHeight;
        }
        layoutAll();
      };
      if (video.readyState >= 1) {
        sync();
      } else {
        video.addEventListener("loadedmetadata", sync);
      }
    });
  }

  function run() {
    bindVideos();
    layoutAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  // Second pass once remaining materials have settled (clips, fonts, layout).
  window.addEventListener("load", function () {
    bindVideos();
    layoutAll();
  });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutAll, 150);
  });
})();
