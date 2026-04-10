---
title: "Basic Flat White"
weight: 5
draft: false
description: "Basic Flat White"
# tags: ["3D-Printed"]
series_order: 1

cascade:
  showReadingTime: false
  showWordCount: false
  showRelated: false
  showDate: false
  showAuthor: false
  showViews: false
  showEdit: false
  showZenMode: false
---

<div id="random-carousel">
  {{< carousel images="img/*" aspectRatio="3-4" interval="0">}}
</div>

{{< gallery >}}
  <img src="img/IMG_4770.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="img/IMG_4772.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="img/IMG_4773.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="img/IMG_4774.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
{{< /gallery >}}

## PRODUCT DETAILS
* Solid block Alphabet. (3D-Printed)
* Clearly visible at all Distance and Angles
* VEP/ANPR Friendly (Readable by camera systems at customs and condominium gantries)f
* UV and chemical resistant
* Adhesive bonded (No gap between alphabets and baseplate)
* 3mm thick Glossy or Matt Satin Casted Acrylic (Laser-cut) (Not laminated)
* Can sanded be down
* Crafted locally in Singapore

<script>
document.addEventListener("DOMContentLoaded", function() {
    // Target all images inside the Blowfish carousel shortcode
    const carouselImages = document.querySelectorAll('#random-carousel img');
    
    if(carouselImages.length > 0) {
        // Step 1: Extract the image data (src, srcset, alt) into an array
        let imageData = Array.from(carouselImages).map(img => ({
            src: img.getAttribute('src'),
            srcset: img.getAttribute('srcset'), // Catches responsive images if Hugo generated them
            alt: img.getAttribute('alt')
        }));
        
        // Step 2: The Fisher-Yates Shuffle Algorithm
        for (let i = imageData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [imageData[i], imageData[j]] = [imageData[j], imageData[i]];
        }
        
        // Step 3: Inject the newly shuffled image data back into the original HTML
        carouselImages.forEach((img, index) => {
            if (imageData[index].src) img.setAttribute('src', imageData[index].src);
            if (imageData[index].srcset) img.setAttribute('srcset', imageData[index].srcset);
            if (imageData[index].alt) img.setAttribute('alt', imageData[index].alt);
        });
    }
});
</script>
