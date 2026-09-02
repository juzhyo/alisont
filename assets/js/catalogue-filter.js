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

  // Sticky category jump bar — links mirror group visibility
  const jumpBar = document.getElementById("catalogue-jump");

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

    // Hide any category group whose cards are all hidden; show the rest
    const visibleGroups = [];
    groups.forEach(function (group) {
      const visible = Array.prototype.some.call(
        group.querySelectorAll("article.article-link--card"),
        function (card) {
          return card.style.display !== "none";
        }
      );
      group.style.display = visible ? "" : "none";
      if (visible) visibleGroups.push(group.id);
    });

    // Jump bar: only show links to groups that still have visible cards
    if (jumpBar) {
      const links = jumpBar.querySelectorAll("a[href^='#']");
      links.forEach(function (link) {
        const targetId = link.getAttribute("href").slice(1);
        link.style.display =
          visibleGroups.indexOf(targetId) !== -1 ? "" : "none";
      });
    }
  }

  // Smooth scroll for jump-bar links (accounts for the fixed header offset)
  if (jumpBar) {
    jumpBar.addEventListener("click", function (e) {
      var link = e.target.closest("a[href^='#']");
      if (!link) return;
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
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
