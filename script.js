
"use strict";

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const navLinks = document.querySelectorAll(".nav-link");

const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchSubmit = document.getElementById("searchSubmit");
const searchClose = document.getElementById("searchClose");
const searchMessage = document.getElementById("searchMessage");

// MOBILE NAVIGATION

function closeMenu() {
  navigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}

menuToggle.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeSearch();
  }
});

// HIGHLIGHT THE CURRENT SECTION

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (a, b) =>
            b.intersectionRatio - a.intersectionRatio
        );

      if (visible.length === 0) return;

      const currentId = visible[0].target.id;

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${currentId}`;

        link.classList.toggle("active", isActive);

        if (isActive) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      rootMargin: "-15% 0px -65% 0px",
      threshold: [0, 0.1, 0.25, 0.5]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// WEBSITE SEARCH

function openSearch() {
  searchPanel.hidden = false;
  searchInput.focus();
}

function closeSearch() {
  searchPanel.hidden = true;
  searchMessage.textContent = "";
}

searchToggle.addEventListener("click", () => {
  if (searchPanel.hidden) {
    openSearch();
  } else {
    closeSearch();
  }
});

searchClose.addEventListener("click", closeSearch);

function searchWebsite() {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    searchMessage.textContent = "Enter a topic to search.";
    searchInput.focus();
    return;
  }

  const searchableItems = [
    ...document.querySelectorAll(
      "main section[id], .career-card, .trophy-card, .stat-card, .timeline-item, .gallery-card, .bio-copy"
    )
  ];

  const results = searchableItems.filter((item) => {
    const text = item.innerText.toLowerCase();
    const heading = item.querySelector("h2, h3, strong");
    const title = heading ? heading.innerText.toLowerCase() : "";

    return text.includes(query) || title.includes(query);
  });

  if (results.length === 0) {
    searchMessage.textContent =
      "No matches found. Try Ronaldo, Portugal, trophies, Madrid, or goals.";
    return;
  }

  const target = results[0];
  const section = target.matches("section[id]")
    ? target
    : target.closest("section[id]");

  if (section) {
    closeSearch();
    section.scrollIntoView({ behavior: "smooth", block: "start" });

    if (section.id === "home") {
      history.replaceState(null, "", "#home");
    } else {
      history.replaceState(null, "", `#${section.id}`);
    }
  } else {
    searchMessage.textContent = "A match was found, but it has no section link.";
  }
}

searchSubmit.addEventListener("click", searchWebsite);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchWebsite();
  }
});

// KEEP THE MOBILE MENU CLOSED WHEN RESIZING TO DESKTOP

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

// SUPPORT DIRECT LINKS TO EACH SECTION

function navigateToHash() {
  if (!window.location.hash) return;

  const target = document.getElementById(
    decodeURIComponent(window.location.hash.slice(1))
  );

  if (target) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    }, 50);
  }
}

window.addEventListener("load", navigateToHash);

console.log("CR7 Legacy website loaded successfully.");
