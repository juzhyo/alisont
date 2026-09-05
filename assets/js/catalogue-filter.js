// Catalogue filter — shows/hides product cards by tag
(function () {
  "use strict";

  const filterBar = document.getElementById("catalogue-filter");
  if (!filterBar) return;

  // Find all product cards on the page
  const cards = document.querySelectorAll("article.article-link--card");
  if (!cards.length) return;

  // Category groups (h2 header + card grid) — hidden when all their cards are filtered out
  const groups = document.querySelectorAll(".catalogue-group");

  const buttons = filterBar.querySelectorAll("[data-filter]");
  let activeFilter = null;

  // Umbrella chips that match several granular tags (e.g. Bikes → motorcycle + e-bike).
  // Keeps product tags precise while letting one chip group related products.
  const filterAliases = {
    bikes: ["motorcycle", "e-bike"],
  };

  function cardMatches(card, tag) {
    const cardTags = (card.getAttribute("data-tags") || "").split(/\s+/);
    const targets = filterAliases[tag] || [tag];
    return targets.some(function (t) {
      return cardTags.indexOf(t) !== -1;
    });
  }

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
      const match = cardMatches(card, tag);
      card.style.display = match ? "" : "none";
    });

    // Hide any category group whose cards are all hidden; show the rest
    groups.forEach(function (group) {
      const visible = Array.prototype.some.call(
        group.querySelectorAll("article.article-link--card"),
        function (card) {
          return card.style.display !== "none";
        }
      );
      group.style.display = visible ? "" : "none";
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
