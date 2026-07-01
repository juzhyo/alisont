// Carousel image shuffle — Fisher-Yates shuffle for product gallery images
// Extracted from individual product pages to a single site-wide asset.
document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll("#random-carousel");

  carousels.forEach(function (carousel) {
    const images = carousel.querySelectorAll("img");
    if (images.length === 0) return;

    // Extract image data (src, srcset, alt)
    const imageData = Array.from(images).map(function (img) {
      return {
        src: img.getAttribute("src"),
        srcset: img.getAttribute("srcset"),
        alt: img.getAttribute("alt"),
      };
    });

    // Fisher-Yates shuffle
    for (let i = imageData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = imageData[i];
      imageData[i] = imageData[j];
      imageData[j] = temp;
    }

    // Inject shuffled data back
    images.forEach(function (img, index) {
      if (imageData[index].src) img.setAttribute("src", imageData[index].src);
      if (imageData[index].srcset)
        img.setAttribute("srcset", imageData[index].srcset);
      if (imageData[index].alt) img.setAttribute("alt", imageData[index].alt);
    });
  });
});
