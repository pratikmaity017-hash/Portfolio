// const contactForm = document.getElementById("contactForm");

// if (contactForm) {
//   contactForm.addEventListener("submit", function (event) {
//     event.preventDefault();

//     if (!contactForm.checkValidity()) {
//       contactForm.reportValidity();
//       return;
//     }

//     let statusMessage = document.getElementById("formStatus");

//     if (!statusMessage) {
//       statusMessage = document.createElement("p");
//       statusMessage.id = "formStatus";
//       statusMessage.setAttribute("role", "status");
//       statusMessage.setAttribute("aria-live", "polite");
//       contactForm.appendChild(statusMessage);
//     }

//     statusMessage.textContent =
//       "Frontend test successful! Backend integration is coming soon.";
//     statusMessage.className = "form-status success";

//     contactForm.reset();
//   });
// }

// const navLinks = document.querySelectorAll(".navbar .sections a");

// const sections = document.querySelectorAll(
//   "#hero, #about, #projects, #contact",
// );

// function updateActiveLink() {
//   const scrollPosition = window.scrollY;
//   const navbar = document.querySelector(".navbar");
//   const offset = (navbar?.offsetHeight || 0) + 80;

//   let currentSection = "hero";

//   sections.forEach((section) => {
//     const sectionTop = section.getBoundingClientRect().top + window.scrollY;

//     if (scrollPosition + offset >= sectionTop) {
//       currentSection = section.id;
//     }
//   });

//   navLinks.forEach((link) => {
//     const isActive = link.hash === `#${currentSection}`;

//     link.classList.toggle("active", isActive);

//     if (isActive) {
//       link.setAttribute("aria-current", "location");
//     } else {
//       link.removeAttribute("aria-current");
//     }
//   });
// }

// window.addEventListener("scroll", updateActiveLink, {
//   passive: true,
// });

// window.addEventListener("resize", updateActiveLink);
// window.addEventListener("load", updateActiveLink);

// updateActiveLink();

// const projectFilters = document.querySelectorAll(".project-filter");
// const projectCards = document.querySelectorAll(".project-card");

// console.log("Filters found:", projectFilters.length);
// console.log("Projects found:", projectCards.length);

// projectFilters.forEach((button) => {
//   button.addEventListener("click", () => {
//     const selectedFilter = button.dataset.filter;
//     console.log("Selected filter:", selectedFilter);

//     projectFilters.forEach((filterButton) => {
//       const isActive = filterButton === button;

//       filterButton.classList.toggle("active", isActive);
//       filterButton.setAttribute("aria-pressed", String(isActive));
//     });

//     projectCards.forEach((card) => {
//       const category = card.dataset.category;

//       const shouldShow =
//         selectedFilter === "all" || category === selectedFilter;

//       card.hidden = !shouldShow;
//     });
//   });
// });

const API_BASE_URL = "https://portfolio-z7ut.onrender.com/api";

/* ========================================
   CONTACT FORM
   Keep the existing frontend test behavior
======================================== */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
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

/* ========================================
   NAVBAR ACTIVE SECTION
======================================== */

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

/* ========================================
   PROJECTS - BACKEND INTEGRATION
======================================== */

const projectsContainer = document.getElementById("projectsContainer");
const projectsStatus = document.getElementById("projectsStatus");

const projectFilters = document.querySelectorAll(".project-filter");

let projects = [];
let activeFilter = "all";

/* Normalize categories for the existing filters */

function normalizeCategory(category) {
  const value = String(category || "")
    .trim()
    .toLowerCase();

  if (value === "full stack" || value === "fullstack") {
    return "fullstack";
  }

  if (value === "ai" || value === "ml" || value === "ai / ml") {
    return "ai";
  }

  if (value === "frontend") {
    return "frontend";
  }

  return "other";
}

/* Safely display text received from the backend */

function escapeHTML(value = "") {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return String(value).replace(/[&<>"']/g, (character) => {
    return entities[character];
  });
}

/* Allow only HTTP and HTTPS links */

function safeUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return "";
  }

  try {
    const url = new URL(value.trim());

    if (url.protocol === "https:" || url.protocol === "http:") {
      return url.href;
    }
  } catch {
    // Ignore invalid URLs.
  }

  return "";
}

/* ========================================
   PROJECT PREVIEWS
   Preserve the original preview structures
======================================== */

function getProjectPreview(project) {
  const category = normalizeCategory(project.category);
  const originalCategory = String(project.category || "")
    .trim()
    .toLowerCase();

  const imageUrl = safeUrl(project.imageUrl);

  // An optional project image can be provided from the admin panel.
  if (imageUrl) {
    return `
      <div class="project-preview">
        <img
          src="${escapeHTML(imageUrl)}"
          alt="${escapeHTML(project.title || "Project preview")}"
          loading="lazy"
          style="width:100%;height:100%;min-height:150px;object-fit:cover;"
        />
      </div>
    `;
  }

  // ML projects use the existing terminal-style preview.
  if (originalCategory === "ml") {
    return `
      <div class="project-preview">
        <div class="preview-terminal">
          <div class="preview-terminal-bar">Python / ML</div>
          <p><span>&gt;</span> Loading model...</p>
          <p class="terminal-success">Model ready ✓</p>
        </div>
      </div>
    `;
  }

  // Original Social Media preview.
  if (category === "fullstack") {
    return `
      <div class="project-preview preview-social">
        <div class="preview-window">
          <div class="preview-dots">
            <span></span><span></span><span></span>
          </div>
          <div class="preview-social-content">
            <div class="preview-avatar"></div>
            <div class="preview-lines">
              <span></span><span></span>
            </div>
          </div>
          <div class="preview-post"></div>
        </div>
      </div>
    `;
  }

  // Original Job Portal preview.
  if (category === "ai") {
    return `
      <div class="project-preview preview-jobs">
        <div class="preview-window">
          <div class="preview-dots">
            <span></span><span></span><span></span>
          </div>
          <div class="preview-job-row">
            <span></span><div></div>
          </div>
          <div class="preview-job-row">
            <span></span><div></div>
          </div>
          <div class="preview-job-row">
            <span></span><div></div>
          </div>
        </div>
      </div>
    `;
  }

  // Original Shabdayon preview for frontend projects.
  return `
    <div class="project-preview preview-shabdayon">
      <div class="shabdayon-preview">
        <div class="shabdayon-preview-nav">
          <span class="shabdayon-logo">Shabdayon</span>
          <span class="shabdayon-menu"></span>
        </div>
        <div class="shabdayon-preview-content">
          <span class="shabdayon-tag">DISCOVER</span>
          <div class="shabdayon-line shabdayon-line-large"></div>
          <div class="shabdayon-line shabdayon-line-small"></div>
          <div class="shabdayon-button"></div>
        </div>
      </div>
    </div>
  `;
}

/* ========================================
   PROJECT LINKS
======================================== */

function getProjectLinks(project) {
  const title = escapeHTML(project.title || "Project");

  const githubUrl = safeUrl(project.githubUrl);
  const liveUrl = safeUrl(project.liveUrl);

  const githubLink = githubUrl
    ? `
      <a
        href="${escapeHTML(githubUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View ${title} source code on GitHub"
      >
        GitHub <span>↗</span>
      </a>
    `
    : `
      <span class="project-link-unavailable">
        Repository link coming soon
      </span>
    `;

  const liveLink = liveUrl
    ? `
      <a
        href="${escapeHTML(liveUrl)}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View ${title} live demo"
      >
        Live Demo <span>↗</span>
      </a>
    `
    : "";

  return `${githubLink}${liveLink}`;
}

/* ========================================
   CREATE A PROJECT CARD
   Reuse existing CSS class names
======================================== */

function renderProjectCard(project, index) {
  const category = normalizeCategory(project.category);

  const technologies = Array.isArray(project.technologies)
    ? project.technologies
    : [];

  const projectNumber = String(index + 1).padStart(2, "0");

  return `
    <article
      class="project-card"
      data-category="${category}"
    >
      ${getProjectPreview(project)}

      <div class="project-number">
        PROJECT ${projectNumber}
      </div>

      <h3>${escapeHTML(project.title || "Untitled Project")}</h3>

      <p>${escapeHTML(project.description || "")}</p>

      <div class="project-tech">
        ${technologies
          .map((technology) => {
            return `<span>${escapeHTML(technology)}</span>`;
          })
          .join("")}
      </div>

      <div class="project-links">
        ${getProjectLinks(project)}
      </div>
    </article>
  `;
}

/* ========================================
   CATEGORY FILTERS
======================================== */

function applyProjectFilter() {
  if (!projectsContainer || !projectsStatus) {
    return;
  }

  const cards = projectsContainer.querySelectorAll(".project-card");

  let visibleCount = 0;

  cards.forEach((card) => {
    const matches =
      activeFilter === "all" || card.dataset.category === activeFilter;

    card.hidden = !matches;

    if (matches) {
      visibleCount++;
    }
  });

  if (projects.length > 0 && visibleCount === 0) {
    projectsStatus.textContent = "No projects in this category yet.";
    projectsStatus.hidden = false;
  } else {
    projectsStatus.hidden = true;
  }
}

/* ========================================
   RENDER PROJECTS
======================================== */

function renderProjects() {
  if (!projectsContainer || !projectsStatus) {
    return;
  }

  if (projects.length === 0) {
    projectsContainer.innerHTML = "";
    projectsStatus.textContent = "No published projects available yet.";
    projectsStatus.hidden = false;
    return;
  }

  projectsContainer.innerHTML = projects
    .map((project, index) => renderProjectCard(project, index))
    .join("");

  projectsStatus.hidden = true;

  applyProjectFilter();
}

/* ========================================
   FETCH PUBLIC PROJECTS FROM THE BACKEND
======================================== */

async function loadProjects() {
  if (!projectsContainer || !projectsStatus) {
    return;
  }

  projectsStatus.textContent = "Loading projects...";
  projectsStatus.hidden = false;

  try {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error("Invalid project response from the server.");
    }

    projects = result.data;

    renderProjects();
  } catch (error) {
    console.error("Failed to load projects:", error);

    projectsContainer.innerHTML = "";

    projectsStatus.textContent =
      "Projects could not be loaded. Please try again later.";

    projectsStatus.hidden = false;
  }
}

/* Attach filter button events */

projectFilters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";

    projectFilters.forEach((filterButton) => {
      const isActive = filterButton === button;

      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    applyProjectFilter();
  });
});

/* Load projects when this script runs */

loadProjects();
