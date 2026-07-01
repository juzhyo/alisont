// Catalogue filter — shows/hides product cards by tag
(function () {
  "use strict";

  const filterBar = document.getElementById("catalogue-filter");
  if (!filterBar) return;

  // Find all product cards on the page
  const cards = document.querySelectorAll("article.article-link--card");
  if (!cards.length) return;

  const buttons = filterBar.querySelectorAll("[data-filter]");
  let activeFilter = null;

  function filterCards(tag) {
    activeFilter = tag;
    buttons.forEach(function (btn) {
      const isActive = btn.getAttribute("data-filter") === tag;
      btn.classList.toggle("active", isActive);
    });

    cards.forEach(function (card) {
      if (!tag) {
        card.style.display = "";
        return;
      }
      const cardTags = (card.getAttribute("data-tags") || "").split(/\s+/);
      const match = cardTags.indexOf(tag) !== -1;
      card.style.display = match ? "" : "none";
    });
  }

  // Click handlers
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const tag = this.getAttribute("data-filter");
      filterCards(tag === activeFilter ? null : tag);
    });
  });
})();
