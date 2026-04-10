---
title: "Frosted"
weight: 1
draft: false
description: "Frosted"
tags: ["Signature","Clearcoated"]
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

<!-- {{< carousel images="img/*" aspectRatio="3-4" interval="0">}} -->
{{< gallery >}}
  <img src="img/5116C43C-B36F-49D2-B65B-3F2B78D5B8C9.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="img/72411AD2-22DF-4DDE-B221-A790EF751D7F.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="img/81E55060-264A-475B-8D83-382E5B60652F.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
  <img src="img/8DDF82BD-F590-4E4E-A8A5-F6AFE26889DF.jpg" class="grid-w50 md:grid-w33 xl:grid-w25" />
{{< /gallery >}}

## PRODUCT DETAILS
* 3D-printed, solid block characters
* MIPA 2K-HS-Klarlack CS95 clearcoat (Germany)
* UV, Chemical resistant
* Adhesive bonded (No gap between alphabets and baseplate)
* 3mm thick Glossy or Matt Satin Casted Acrylic (Laser-cut) (Not laminated)
* Clearly visible at all Distance and Angles
* VEP/ANPR Friendly (readable by camera systems at customs and condominium gantries)
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
