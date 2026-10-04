"use strict";

const collectionGrid = document.querySelector(".collection-grid");
const detailsPanel = document.querySelector("#details-panel");
const detailsTitle = document.querySelector("#details-title");
const detailsDescription = document.querySelector("#details-description");

const filterButtons = Array.from(
  document.querySelectorAll(".filter-button")
);
const visibleCount = document.querySelector("#visible-count");
const randomButton = document.querySelector("#random-button");
const resetButton = document.querySelector("#reset-button");

const historyList = document.querySelector("#selection-history");
const historyEmpty = document.querySelector("#history-empty");

const initialTitle = detailsTitle.textContent;
const initialDescription = detailsDescription.textContent;

let selectedCard = null;
let selectionHistory = [];

function getCards() {
  return Array.from(collectionGrid.querySelectorAll(".collection-card"));
}

function getVisibleCards() {
  return getCards().filter(
    (card) => !card.classList.contains("collection-card--hidden")
  );
}

function renderHistory() {
  historyList.replaceChildren();

  selectionHistory.forEach((card) => {
    const item = document.createElement("li");
    item.textContent = card.dataset.title;
    historyList.append(item);
  });

  historyEmpty.hidden = selectionHistory.length > 0;
}

function clearSelection() {
  getCards().forEach((card) => {
    card.classList.remove("collection-card--selected");
    card.setAttribute("aria-pressed", "false");
  });

  selectedCard = null;
  detailsTitle.textContent = initialTitle;
  detailsDescription.textContent = initialDescription;
  detailsPanel.classList.remove("details-panel--pulse");
}

function applyFilter(category) {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === category;

    button.classList.toggle("filter-button--active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  getCards().forEach((card) => {
    const isHidden =
      category !== "all" && card.dataset.category !== category;

    card.classList.toggle("collection-card--hidden", isHidden);
  });

  if (
    selectedCard &&
    selectedCard.classList.contains("collection-card--hidden")
  ) {
    clearSelection();
  }

  visibleCount.textContent = getVisibleCards().length;
}

function selectRandomCard() {
  const visibleCards = getVisibleCards();
  const otherCards = visibleCards.filter(
    (card) => card !== selectedCard
  );

  const candidates =
    otherCards.length > 0 ? otherCards : visibleCards;

  if (candidates.length === 0) {
    return;
  }

  const index = Math.floor(Math.random() * candidates.length);
  selectCard(candidates[index]);
}

function resetCollection() {
  applyFilter("all");
  clearSelection();

  selectionHistory = [];
  renderHistory();
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

  selectionHistory = [
    card,
    ...selectionHistory.filter((item) => item !== card)
  ].slice(0, 3);

  renderHistory();

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

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyFilter(button.dataset.filter);
  });
});

randomButton.addEventListener("click", selectRandomCard);
resetButton.addEventListener("click", resetCollection);

document.addEventListener("keydown", (event) => {

  if (event.key === "Escape") {
    event.preventDefault();

    const focusedCard = event.target.closest(".collection-card");

    resetCollection();

    if (focusedCard) {
      const allButton = filterButtons.find(
        (button) => button.dataset.filter === "all"
      );
      allButton.focus();
    }

    return;
  }

  if (!event.target.closest(".workspace") || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) {
    return;
  }

  const visibleCards = getVisibleCards();

  if (visibleCards.length === 0) {
    return;
  }

  event.preventDefault();

  const currentIndex = visibleCards.indexOf(selectedCard);
  let nextIndex;

  if (currentIndex === -1) {
    nextIndex = event.key === "ArrowRight" ? 0 : visibleCards.length - 1;
  } else {
    const direction = event.key === "ArrowRight" ? 1 : -1;

    nextIndex = (currentIndex + direction + visibleCards.length) % visibleCards.length;
  }

  const nextCard = visibleCards[nextIndex];

  selectCard(nextCard);
  nextCard.focus();
});

applyFilter("all");
renderHistory();