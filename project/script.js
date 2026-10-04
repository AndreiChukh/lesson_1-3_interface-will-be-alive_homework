"use strict";

const collectionGrid = document.querySelector(".collection-grid");
const detailsPanel = document.querySelector("#details-panel");
const detailsTitle = document.querySelector("#details-title");
const detailsDescription = document.querySelector("#details-description");

let selectedCard = null;

function getCards() {
  return Array.from(collectionGrid.querySelectorAll(".collection-card"));
}

function selectCard(card) {
  if (!card || card.classList.contains("collection-card--hidden")) {
    return;
  }

  getCards().forEach((item) => {
    const isSelected = item === card;
    item.classList.toggle("collection-card--selected", isSelected);
    item.setAttribute("aria-pressed", String(isSelected));
  });

  selectedCard = card;
  detailsTitle.textContent = card.dataset.title;
  detailsDescription.textContent = card.dataset.description;

  detailsPanel.classList.remove("details-panel--pulse");
  void detailsPanel.offsetWidth;
  detailsPanel.classList.add("details-panel--pulse");
}

collectionGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".collection-card");

  if (card && collectionGrid.contains(card)) {
    selectCard(card);
  }
});

detailsPanel.addEventListener("animationend", (event) => {
  if (
    event.target === detailsPanel &&
    event.animationName === "panel-pulse"
  ) {
    detailsPanel.classList.remove("details-panel--pulse");
  }
});