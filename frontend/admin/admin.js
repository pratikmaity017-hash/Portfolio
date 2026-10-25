const STORAGE_KEY = "portfolio_admin_projects_v1";

// ========================================
// DOM ELEMENTS
// ========================================

const pageTitle = document.getElementById("pageTitle");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");

const navLinks = document.querySelectorAll(".nav-link");
const adminPages = document.querySelectorAll(".admin-page");
const pageButtons = document.querySelectorAll("[data-go-page]");

const projectForm = document.getElementById("projectForm");
const projectIdInput = document.getElementById("projectId");
const projectTitleInput = document.getElementById("projectTitle");
const projectDescriptionInput = document.getElementById("projectDescription");
const projectCategoryInput = document.getElementById("projectCategory");
const projectTechnologiesInput = document.getElementById("projectTechnologies");
const githubUrlInput = document.getElementById("githubUrl");
const liveUrlInput = document.getElementById("liveUrl");
const projectImageInput = document.getElementById("projectImage");

const formPageTitle = document.getElementById("formPageTitle");
const saveProjectBtn = document.getElementById("saveProjectBtn");
const cancelFormBtn = document.getElementById("cancelFormBtn");
const formMessage = document.getElementById("formMessage");

const recentProjectsTable = document.getElementById("recentProjectsTable");
const projectsTableBody = document.getElementById("projectsTableBody");

const projectSearch = document.getElementById("projectSearch");
const categoryFilter = document.getElementById("categoryFilter");

// ========================================
// INITIAL DEMO DATA
// ========================================

const initialProjects = [
  {
    id: "demo-social-media",
    title: "MERN Social Media Platform",
    description:
      "A full-stack social media application with authentication and media uploads.",
    category: "fullstack",
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    githubUrl: "https://github.com/pratikmaity017-hash/social-media-project",
    liveUrl: "https://social-media-project-weld.vercel.app/",
    imageUrl: "",
  },
  {
    id: "demo-job-portal",
    title: "MERN Job Portal",
    description:
      "A job portal with resume matching powered by a Python FastAPI service.",
    category: "ai",
    technologies: ["React", "Node.js", "MongoDB", "Python"],
    githubUrl: "",
    liveUrl: "",
    imageUrl: "",
  },
  {
    id: "demo-shabdayon",
    title: "Shabdayon Website",
    description:
      "A responsive website project built with HTML, CSS and JavaScript.",
    category: "frontend",
    technologies: ["HTML", "CSS", "JavaScript"],
    githubUrl:
      "https://github.com/pratikmaity017-hash/final-shabdayan-website-frontend-version",
    liveUrl:
      "https://pratikmaity017-hash.github.io/final-shabdayan-website-frontend-version/",
    imageUrl: "",
  },
];

// ========================================
// PROJECT STORAGE
// ========================================

function loadProjects() {
  try {
    const savedProjects = localStorage.getItem(STORAGE_KEY);

    if (savedProjects === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProjects));

      return [...initialProjects];
    }

    const parsedProjects = JSON.parse(savedProjects);

    if (!Array.isArray(parsedProjects)) {
      throw new Error("Stored project data is invalid.");
    }

    return parsedProjects;
  } catch (error) {
    console.error("Could not load projects:", error);

    showFormMessage(
      "Could not load saved projects. Check browser storage.",
      "error",
    );

    return [];
  }
}

let projects = loadProjects();

function saveProjects() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

    return true;
  } catch (error) {
    console.error("Could not save projects:", error);
    showFormMessage(
      "Could not save data. Browser storage may be unavailable or full.",
      "error",
    );

    return false;
  }
}

// ========================================
// PAGE NAVIGATION
// ========================================

const pageNames = {
  dashboard: "Dashboard",
  projects: "Manage Projects",
  "add-project": "Add New Project",
};

function showPage(pageId) {
  const targetPage = document.getElementById(pageId);

  if (!targetPage || !targetPage.classList.contains("admin-page")) {
    return;
  }

  adminPages.forEach((page) => {
    page.classList.toggle("active", page.id === pageId);
  });

  navLinks.forEach((link) => {
    const isActive = link.dataset.page === pageId;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  pageTitle.textContent = pageNames[pageId] || "Admin Dashboard";

  closeSidebar();

  if (pageId === "dashboard") {
    renderDashboard();
  }

  if (pageId === "projects") {
    renderProjectsTable();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    showPage(link.dataset.page);
  });
});

pageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetPage = button.dataset.goPage;

    if (targetPage === "add-project") {
      resetProjectForm();
    }

    showPage(targetPage);
  });
});

// ========================================
// MOBILE SIDEBAR
// ========================================

function closeSidebar() {
  sidebar.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (
    window.innerWidth <= 900 &&
    sidebar.classList.contains("open") &&
    !sidebar.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeSidebar();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeSidebar();
  }
});

// ========================================
// SAFE HTML HELPERS
// ========================================

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function getCategoryLabel(category) {
  const labels = {
    fullstack: "Full Stack",
    ai: "AI / ML",
    frontend: "Frontend",
  };

  return labels[category] || "Other";
}

function renderTechnologies(technologies = []) {
  if (!Array.isArray(technologies)) {
    return "";
  }

  return `
    <div class="technology-list">
      ${technologies
        .map(
          (technology) =>
            `<span class="technology-tag">${escapeHTML(technology)}</span>`,
        )
        .join("")}
    </div>
  `;
}

// ========================================
// DASHBOARD STATISTICS
// ========================================

function renderDashboard() {
  document.getElementById("totalProjects").textContent = projects.length;

  document.getElementById("fullStackProjects").textContent = projects.filter(
    (project) => project.category === "fullstack",
  ).length;

  document.getElementById("aiProjects").textContent = projects.filter(
    (project) => project.category === "ai",
  ).length;

  document.getElementById("frontendProjects").textContent = projects.filter(
    (project) => project.category === "frontend",
  ).length;

  const recentProjects = [...projects].slice(-5).reverse();

  if (recentProjects.length === 0) {
    recentProjectsTable.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          No projects yet. Add your first project.
        </td>
      </tr>
    `;

    return;
  }

  recentProjectsTable.innerHTML = recentProjects
    .map(
      (project) => `
        <tr>
          <td>${escapeHTML(project.title)}</td>
          <td>
            <span class="category-badge">
              ${escapeHTML(getCategoryLabel(project.category))}
            </span>
          </td>
          <td>${renderTechnologies(project.technologies)}</td>
          <td>
            <div class="action-buttons">
              <button
                type="button"
                class="action-btn"
                data-action="edit"
                data-id="${escapeHTML(project.id)}"
              >
                Edit
              </button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");
}

// ========================================
// PROJECT TABLE
// ========================================

function renderProjectsTable() {
  const searchTerm = projectSearch.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = [
      project.title,
      project.description,
      ...(Array.isArray(project.technologies) ? project.technologies : []),
    ]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (filteredProjects.length === 0) {
    projectsTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          No matching projects found.
        </td>
      </tr>
    `;

    return;
  }

  projectsTableBody.innerHTML = filteredProjects
    .map(
      (project) => `
        <tr>
          <td>${escapeHTML(project.title)}</td>
          <td>
            <span class="category-badge">
              ${escapeHTML(getCategoryLabel(project.category))}
            </span>
          </td>
          <td>${renderTechnologies(project.technologies)}</td>
          <td>
            <div class="action-buttons">
              <button
                type="button"
                class="action-btn"
                data-action="edit"
                data-id="${escapeHTML(project.id)}"
              >
                Edit
              </button>

              <button
                type="button"
                class="action-btn delete"
                data-action="delete"
                data-id="${escapeHTML(project.id)}"
              >
                Delete
              </button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");
}

projectSearch.addEventListener("input", renderProjectsTable);
categoryFilter.addEventListener("change", renderProjectsTable);

// ========================================
// EDIT AND DELETE ACTIONS
// ========================================

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");

  if (!actionButton) {
    return;
  }

  const projectId = actionButton.dataset.id;
  const action = actionButton.dataset.action;

  if (action === "edit") {
    editProject(projectId);
  }

  if (action === "delete") {
    deleteProject(projectId);
  }
});

function editProject(projectId) {
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return;
  }

  projectIdInput.value = project.id;
  projectTitleInput.value = project.title;
  projectDescriptionInput.value = project.description;
  projectCategoryInput.value = project.category;
  projectTechnologiesInput.value = Array.isArray(project.technologies)
    ? project.technologies.join(", ")
    : "";

  githubUrlInput.value = project.githubUrl || "";
  liveUrlInput.value = project.liveUrl || "";
  projectImageInput.value = project.imageUrl || "";

  formPageTitle.textContent = "Edit Project";
  saveProjectBtn.textContent = "Update Project";
  showFormMessage("", "");

  showPage("add-project");
}

function deleteProject(projectId) {
  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return;
  }

  const confirmed = window.confirm(
    `Are you sure you want to delete "${project.title}"?`,
  );

  if (!confirmed) {
    return;
  }

  const previousProjects = projects;

  projects = projects.filter((item) => item.id !== projectId);

  if (!saveProjects()) {
    projects = previousProjects;
    return;
  }

  renderDashboard();
  renderProjectsTable();
}

// ========================================
// ADD AND UPDATE PROJECTS
// ========================================

function resetProjectForm() {
  projectForm.reset();
  projectIdInput.value = "";

  formPageTitle.textContent = "Add New Project";
  saveProjectBtn.textContent = "Save Project";

  showFormMessage("", "");
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = type ? `form-message ${type}` : "form-message";
}

function isValidOptionalURL(value) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

projectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!projectForm.reportValidity()) {
    return;
  }

  const title = projectTitleInput.value.trim();
  const description = projectDescriptionInput.value.trim();
  const category = projectCategoryInput.value;

  const technologies = projectTechnologiesInput.value
    .split(",")
    .map((technology) => technology.trim())
    .filter(Boolean);

  const githubUrl = githubUrlInput.value.trim();
  const liveUrl = liveUrlInput.value.trim();
  const imageUrl = projectImageInput.value.trim();

  if (!title || !description || technologies.length === 0) {
    showFormMessage("Please complete all required fields.", "error");

    return;
  }

  if (!["fullstack", "ai", "frontend"].includes(category)) {
    showFormMessage("Please select a valid category.", "error");
    return;
  }

  if (
    !isValidOptionalURL(githubUrl) ||
    !isValidOptionalURL(liveUrl) ||
    !isValidOptionalURL(imageUrl)
  ) {
    showFormMessage("URLs must start with http:// or https://.", "error");

    return;
  }

  const projectData = {
    id: projectIdInput.value || crypto.randomUUID(),
    title,
    description,
    category,
    technologies,
    githubUrl,
    liveUrl,
    imageUrl,
  };

  const existingIndex = projects.findIndex(
    (project) => project.id === projectData.id,
  );

  const previousProjects = [...projects];

  if (existingIndex >= 0) {
    projects[existingIndex] = projectData;
  } else {
    projects.push(projectData);
  }

  if (!saveProjects()) {
    projects = previousProjects;
    return;
  }

  renderDashboard();
  renderProjectsTable();

  resetProjectForm();
  showPage("projects");
});

// ========================================
// CANCEL FORM
// ========================================

cancelFormBtn.addEventListener("click", () => {
  resetProjectForm();
  showPage("projects");
});

// ========================================
// INITIAL RENDER
// ========================================

renderDashboard();
renderProjectsTable();
showPage("dashboard");
