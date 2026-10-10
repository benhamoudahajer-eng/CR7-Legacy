
"use strict";

// CR7 LEGACY — FULL INTERACTIVITY

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const navLinks = document.querySelectorAll(".nav-link");

const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const searchSubmit = document.getElementById("searchSubmit");
const searchClose = document.getElementById("searchClose");
const searchMessage = document.getElementById("searchMessage");

// MOBILE MENU

function closeMenu() {
  if (!navigation || !menuToggle) return;

  navigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// SEARCH PANEL

function openSearch() {
  if (!searchPanel || !searchInput) return;

  searchPanel.hidden = false;
  searchInput.focus();
}

function closeSearch() {
  if (!searchPanel) return;

  searchPanel.hidden = true;

  if (searchMessage) {
    searchMessage.textContent = "";
  }
}

if (searchToggle) {
  searchToggle.addEventListener("click", () => {
    if (!searchPanel) return;

    if (searchPanel.hidden) {
      openSearch();
    } else {
      closeSearch();
    }
  });
}

if (searchClose) {
  searchClose.addEventListener("click", closeSearch);
}

// SEARCH ALL MAIN SECTIONS

function searchWebsite() {
  if (!searchInput || !searchMessage) return;

  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    searchMessage.textContent = "Enter a topic to search.";
    searchInput.focus();
    return;
  }

  const searchableItems = document.querySelectorAll(
    "main section[id], .career-card, .trophy-card, .stat-card, .timeline-item, .gallery-card, .bio-copy"
  );

  const results = Array.from(searchableItems).filter((item) => {
    return item.innerText.toLowerCase().includes(query);
  });

  if (!results.length) {
    searchMessage.textContent =
      "No matches found. Try Ronaldo, Portugal, trophies, Madrid, or goals.";
    return;
  }

  const target = results[0];
  const section = target.matches("section[id]")
    ? target
    : target.closest("section[id]");

  if (!section) {
    searchMessage.textContent = "No section found for this result.";
    return;
  }

  closeSearch();
  history.replaceState(null, "", `#${section.id}`);

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

if (searchSubmit) {
  searchSubmit.addEventListener("click", searchWebsite);
}

if (searchInput) {
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchWebsite();
    }
  });
}

// CURRENT SECTION HIGHLIGHT

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;

      const currentId = visible[0].target.id;

      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${currentId}`;

        link.classList.toggle("active", active);

        if (active) {
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

  sections.forEach((section) => sectionObserver.observe(section));
}

// ANIMATED COUNTERS

const counters = document.querySelectorAll(".stat-number[data-count]");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function formatCounter(value) {
  return Math.round(value).toLocaleString("en-US");
}

function animateCounter(element) {
  if (element.dataset.animated === "true") return;

  element.dataset.animated = "true";

  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || "";

  if (!Number.isFinite(target)) return;

  if (reducedMotion) {
    element.textContent = formatCounter(target) + suffix;
    element.closest(".stat-card")?.classList.add("counted");
    return;
  }

  const duration = 1600;
  const startTime = performance.now();

  function updateCounter(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);

    element.textContent = formatCounter(target * eased) + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = formatCounter(target) + suffix;
      element.closest(".stat-card")?.classList.add("counted");
    }
  }

  requestAnimationFrame(updateCounter);
}

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(animateCounter);
}

// INTERACTIVE TROPHY CARDS
// Open one card at a time.

document.querySelectorAll(".trophy-card").forEach((card) => {
  card.addEventListener("toggle", () => {
    if (!card.open) return;

    document.querySelectorAll(".trophy-card[open]").forEach((other) => {
      if (other !== card) other.open = false;
    });
  });
});

// ESCAPE KEY AND RESPONSIVE MENU

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
    closeSearch();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});

// DIRECT SECTION LINKS

function navigateToHash() {
  if (!window.location.hash) return;

  let id;

  try {
    id = decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return;
  }

  const target = document.getElementById(id);

  if (target) {
    target.scrollIntoView({
      behavior: "auto",
      block: "start"
    });
  }
}

window.addEventListener("load", navigateToHash);

console.log("CR7 Legacy is ready. SIUUU!");
