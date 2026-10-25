const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    let statusMessage = document.getElementById("formStatus");

    if (!statusMessage) {
      statusMessage = document.createElement("p");
      statusMessage.id = "formStatus";
      statusMessage.setAttribute("role", "status");
      statusMessage.setAttribute("aria-live", "polite");
      contactForm.appendChild(statusMessage);
    }

    statusMessage.textContent =
      "Frontend test successful! Backend integration is coming soon.";
    statusMessage.className = "form-status success";

    contactForm.reset();
  });
}

const navLinks = document.querySelectorAll(".navbar .sections a");

const sections = document.querySelectorAll(
  "#hero, #about, #projects, #contact",
);

function updateActiveLink() {
  const scrollPosition = window.scrollY;
  const navbar = document.querySelector(".navbar");
  const offset = (navbar?.offsetHeight || 0) + 80;

  let currentSection = "hero";

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;

    if (scrollPosition + offset >= sectionTop) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.hash === `#${currentSection}`;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("scroll", updateActiveLink, {
  passive: true,
});

window.addEventListener("resize", updateActiveLink);
window.addEventListener("load", updateActiveLink);

updateActiveLink();

const projectFilters = document.querySelectorAll(".project-filter");
const projectCards = document.querySelectorAll(".project-card");

console.log("Filters found:", projectFilters.length);
console.log("Projects found:", projectCards.length);

projectFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    console.log("Selected filter:", selectedFilter);

    projectFilters.forEach((filterButton) => {
      const isActive = filterButton === button;

      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach((card) => {
      const category = card.dataset.category;

      const shouldShow =
        selectedFilter === "all" || category === selectedFilter;

      card.hidden = !shouldShow;
    });
  });
});
