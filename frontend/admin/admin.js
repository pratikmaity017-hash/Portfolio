const API_BASE_URL = "https://portfolio-z7ut.onrender.com/api";

async function checkAdminSession() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 401 || response.status === 403) {
      window.location.replace("login.html");
      return false;
    }

    if (!response.ok) {
      throw new Error("Unable to verify admin session.");
    }

    return true;
  } catch (error) {
    console.error("Session verification failed:", error);

    document.body.textContent =
      "Unable to connect to the server. Please try again.";

    return false;
  }
}

// ADD THESE TWO FUNCTIONS HERE

function categoryToApi(category) {
  const categories = {
    fullstack: "Full Stack",
    ai: "AI",
    frontend: "Frontend",
  };

  return categories[category] || category;
}

function categoryFromApi(category) {
  const categories = {
    "Full Stack": "fullstack",
    AI: "ai",
    ML: "ai",
    Frontend: "frontend",
  };

  return categories[category] || "frontend";
}

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

let projects = [];

let csrfToken = null;

async function getCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok || !result.csrfToken) {
    throw new Error(result.message || "Unable to get CSRF token.");
  }

  csrfToken = result.csrfToken;
  return csrfToken;
}

async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...options.headers,
  };

  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    if (!csrfToken) {
      await getCsrfToken();
    }

    headers["X-CSRF-Token"] = csrfToken;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    headers,
    credentials: "include",
  });

  const result = await response.json().catch(() => ({}));

  if (response.status === 401) {
    window.location.replace("login.html");
    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(result.message || `Request failed (${response.status}).`);
  }

  return result;
}

function normalizeProject(project) {
  return {
    ...project,
    id: project._id || project.id,
    category: categoryFromApi(project.category),
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : [],
    githubUrl: project.githubUrl || "",
    liveUrl: project.liveUrl || "",
    imageUrl: project.imageUrl || "",
  };
}

async function loadProjects() {
  const result = await apiRequest("/projects/admin");

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid project data received from server.");
  }

  projects = result.data.map(normalizeProject);
}

async function refreshProjects() {
  await loadProjects();
  renderDashboard();
  renderProjectsTable();
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

async function deleteProject(projectId) {
  const project = projects.find((item) => item.id === projectId);

  if (!project) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${project.title}"?`,
  );

  if (!confirmed) return;

  try {
    await apiRequest(`/projects/${encodeURIComponent(projectId)}`, {
      method: "DELETE",
    });

    await refreshProjects();
    showFormMessage("Project deleted successfully.", "success");
  } catch (error) {
    console.error("Delete project failed:", error);
    showFormMessage(error.message || "Could not delete project.", "error");
  }
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

projectForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!projectForm.reportValidity()) return;

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
    title,
    description,
    category: categoryToApi(category),
    technologies,
    githubUrl,
    liveUrl,
    imageUrl,
  };

  const projectId = projectIdInput.value.trim();

  saveProjectBtn.disabled = true;
  showFormMessage("Saving project...", "");

  try {
    if (projectId) {
      await apiRequest(`/projects/${encodeURIComponent(projectId)}`, {
        method: "PATCH",
        body: JSON.stringify(projectData),
      });
    } else {
      await apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify(projectData),
      });
    }

    await refreshProjects();

    resetProjectForm();
    showPage("projects");
    showFormMessage("Project saved successfully.", "success");
  } catch (error) {
    console.error("Save project failed:", error);
    showFormMessage(error.message || "Could not save project.", "error");
  } finally {
    saveProjectBtn.disabled = false;
  }
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

async function initializeAdminDashboard() {
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) return;

  try {
    await refreshProjects();
    showPage("dashboard");
  } catch (error) {
    console.error("Could not initialize dashboard:", error);
    showFormMessage(
      error.message || "Could not load projects from the server.",
      "error",
    );
  }
}

initializeAdminDashboard();

