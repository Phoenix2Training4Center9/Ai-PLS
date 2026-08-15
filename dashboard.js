/* =========================================================
   AI PLS — DASHBOARD ENGINE
   Personal Learning System
   ========================================================= */

"use strict";

/* =========================================================
   01. APP STATE
========================================================= */

const AI_PLS_STATE_KEY = "ai-pls-dashboard-state";

const defaultState = {
  user: {
    name: "بشار",
    level: "متعلم نشط"
  },

  stats: {
    progress: 78,
    streak: 12,
    activeSubjects: 8,
    completedLessons: 24
  },

  tasks: [
    {
      id: 1,
      title: "مراجعة درس الذكاء الاصطناعي",
      subject: "الذكاء الاصطناعي",
      completed: false
    },

    {
      id: 2,
      title: "حل اختبار Python",
      subject: "Python",
      completed: false
    },

    {
      id: 3,
      title: "قراءة الفصل الثالث",
      subject: "علوم الحاسوب",
      completed: true
    }
  ]
};


/* =========================================================
   02. STATE MANAGEMENT
========================================================= */

function loadState() {

  try {

    const saved =
      localStorage.getItem(AI_PLS_STATE_KEY);

    if (!saved) {
      return structuredClone(defaultState);
    }

    return {
      ...structuredClone(defaultState),
      ...JSON.parse(saved)
    };

  } catch (error) {

    console.warn(
      "AI PLS: Could not load saved state.",
      error
    );

    return structuredClone(defaultState);
  }
}


function saveState() {

  try {

    localStorage.setItem(
      AI_PLS_STATE_KEY,
      JSON.stringify(state)
    );

  } catch (error) {

    console.warn(
      "AI PLS: Could not save state.",
      error
    );
  }
}


const state = loadState();


/* =========================================================
   03. DOM HELPERS
========================================================= */

function $(selector, parent = document) {
  return parent.querySelector(selector);
}


function $$(selector, parent = document) {
  return [
    ...parent.querySelectorAll(selector)
  ];
}


function createElement(tag, className = "", text = "") {

  const element =
    document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}


/* =========================================================
   04. DASHBOARD INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initializeDashboard
);


function initializeDashboard() {

  console.log(
    "AI PLS Dashboard initialized."
  );

  setupNavigation();

  setupMobileSidebar();

  setupDashboardButtons();

  renderUser();

  renderStats();

  renderTasks();

  renderProgress();

  setupKeyboardShortcuts();

}


/* =========================================================
   05. USER
========================================================= */

function renderUser() {

  const nameElements = $$(
    "[data-user-name]"
  );

  nameElements.forEach(element => {

    element.textContent =
      state.user.name;

  });


  const levelElements = $$(
    "[data-user-level]"
  );

  levelElements.forEach(element => {

    element.textContent =
      state.user.level;

  });
}


/* =========================================================
   06. STATISTICS
========================================================= */

function renderStats() {

  const progressElements =
    $$("[data-stat='progress']");

  progressElements.forEach(element => {

    element.textContent =
      `${state.stats.progress}%`;

  });


  const streakElements =
    $$("[data-stat='streak']");

  streakElements.forEach(element => {

    element.textContent =
      state.stats.streak;

  });


  const subjectsElements =
    $$("[data-stat='subjects']");

  subjectsElements.forEach(element => {

    element.textContent =
      state.stats.activeSubjects;

  });


  const lessonsElements =
    $$("[data-stat='lessons']");

  lessonsElements.forEach(element => {

    element.textContent =
      state.stats.completedLessons;

  });
}


/* =========================================================
   07. PROGRESS
========================================================= */

function renderProgress() {

  const progressBars =
    $$("[data-progress-bar]");

  progressBars.forEach(bar => {

    const progress =
      Math.max(
        0,
        Math.min(
          100,
          state.stats.progress
        )
      );

    bar.style.width =
      `${progress}%`;

    bar.setAttribute(
      "aria-valuenow",
      progress
    );

  });
}


/* =========================================================
   08. TASKS
========================================================= */

function renderTasks() {

  const containers =
    $$("[data-tasks-container]");

  containers.forEach(container => {

    container.innerHTML = "";

    if (!state.tasks.length) {

      const empty =
        createElement(
          "div",
          "empty-state"
        );

      empty.textContent =
        "لا توجد مهام حالياً.";

      container.appendChild(empty);

      return;
    }


    state.tasks.forEach(task => {

      const item =
        createTaskElement(task);

      container.appendChild(item);

    });

  });
}


function createTaskElement(task) {

  const article =
    createElement(
      "article",
      "task-item"
    );

  article.dataset.taskId =
    task.id;


  const checkbox =
    createElement(
      "button",
      "task-checkbox"
    );

  checkbox.type = "button";

  checkbox.setAttribute(
    "aria-label",
    task.completed
      ? "إلغاء إكمال المهمة"
      : "إكمال المهمة"
  );


  if (task.completed) {

    checkbox.classList.add(
      "completed"
    );

    checkbox.textContent = "✓";

  } else {

    checkbox.textContent = "";

  }


  checkbox.addEventListener(
    "click",
    () => toggleTask(task.id)
  );


  const content =
    createElement(
      "div",
      "task-content"
    );


  const title =
    createElement(
      "h4",
      "",
      task.title
    );


  const subject =
    createElement(
      "span",
      "",
      task.subject
    );


  if (task.completed) {

    title.classList.add(
      "completed"
    );

  }


  content.appendChild(title);

  content.appendChild(subject);


  article.appendChild(checkbox);

  article.appendChild(content);


  return article;
}


function toggleTask(taskId) {

  const task =
    state.tasks.find(
      item => item.id === taskId
    );

  if (!task) return;


  task.completed =
    !task.completed;


  updateProgressFromTasks();

  saveState();

  renderTasks();

  renderStats();

  renderProgress();

  showToast(
    task.completed
      ? "تم إنجاز المهمة ✓"
      : "تمت إعادة المهمة"
  );
}


/* =========================================================
   09. AUTOMATIC PROGRESS
========================================================= */

function updateProgressFromTasks() {

  if (!state.tasks.length) {
    return;
  }


  const completed =
    state.tasks.filter(
      task => task.completed
    ).length;


  const taskProgress =
    Math.round(
      (completed /
        state.tasks.length) *
      100
    );


  /*
   * We don't replace the entire learning
   * progress with task progress.
   *
   * Instead, we gently adjust it.
   */

  state.stats.progress =
    Math.max(
      state.stats.progress,
      taskProgress
    );


  state.stats.completedLessons =
    state.tasks.filter(
      task => task.completed
    ).length;
}


/* =========================================================
   10. NAVIGATION
========================================================= */

function setupNavigation() {

  const navItems =
    $$(".nav-item");


  navItems.forEach(item => {

    item.addEventListener(
      "click",
      () => {

        navItems.forEach(nav => {

          nav.classList.remove(
            "active"
          );

        });


        item.classList.add(
          "active"
        );


        const target =
          item.dataset.target;


        if (target) {

          navigateToSection(
            target
          );

        }

      }
    );

  });
}


function navigateToSection(target) {

  const sections =
    $$("[data-dashboard-section]");


  let found = false;


  sections.forEach(section => {

    const matches =
      section.dataset.dashboardSection ===
      target;


    section.hidden =
      !matches;


    if (matches) {
      found = true;
    }

  });


  if (!found) {

    console.warn(
      `AI PLS: Section "${target}" not found.`
    );

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   11. MOBILE SIDEBAR
========================================================= */

function setupMobileSidebar() {

  const sidebar =
    $(".sidebar");

  const toggle =
    $("[data-sidebar-toggle]");

  const overlay =
    $(".sidebar-overlay");


  if (!sidebar || !toggle) {
    return;
  }


  toggle.addEventListener(
    "click",
    () => {

      sidebar.classList.toggle(
        "open"
      );


      if (overlay) {

        overlay.classList.toggle(
          "visible"
        );

      }

    }
  );


  if (overlay) {

    overlay.addEventListener(
      "click",
      closeSidebar
    );

  }


  $$(".nav-item").forEach(item => {

    item.addEventListener(
      "click",
      closeSidebar
    );

  });


  function closeSidebar() {

    sidebar.classList.remove(
      "open"
    );


    if (overlay) {

      overlay.classList.remove(
        "visible"
      );

    }

  }
}


/* =========================================================
   12. DASHBOARD BUTTONS
========================================================= */

function setupDashboardButtons() {

  const resetButton =
    $("[data-reset-dashboard]");


  if (resetButton) {

    resetButton.addEventListener(
      "click",
      resetDashboard
    );

  }


  const logoutButton =
    $("[data-logout]");


  if (logoutButton) {

    logoutButton.addEventListener(
      "click",
      () => {

        showToast(
          "سيتم ربط تسجيل الخروج بنظام الحسابات لاحقاً."
        );

      }
    );

  }


  const addTaskButton =
    $("[data-add-task]");


  if (addTaskButton) {

    addTaskButton.addEventListener(
      "click",
      addTask
    );

  }
}


/* =========================================================
   13. ADD TASK
========================================================= */

function addTask() {

  const title =
    window.prompt(
      "اكتب اسم المهمة:"
    );


  if (!title || !title.trim()) {
    return;
  }


  const subject =
    window.prompt(
      "اكتب المادة:"
    ) ||
    "عام";


  const newTask = {

    id:
      Date.now(),

    title:
      title.trim(),

    subject:
      subject.trim(),

    completed:
      false

  };


  state.tasks.unshift(
    newTask
  );


  saveState();

  renderTasks();

  showToast(
    "تمت إضافة المهمة بنجاح ✓"
  );
}


/* =========================================================
   14. RESET
========================================================= */

function resetDashboard() {

  const confirmed =
    window.confirm(
      "هل تريد إعادة لوحة التحكم إلى حالتها الافتراضية؟"
    );


  if (!confirmed) {
    return;
  }


  localStorage.removeItem(
    AI_PLS_STATE_KEY
  );


  window.location.reload();
}


/* =========================================================
   15. TOAST
========================================================= */

function showToast(message) {

  let toast =
    $(".ai-pls-toast");


  if (!toast) {

    toast =
      createElement(
        "div",
        "ai-pls-toast"
      );

    document.body.appendChild(
      toast
    );

  }


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    showToast.timeout
  );


  showToast.timeout =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2500
    );
}


/* =========================================================
   16. KEYBOARD SHORTCUTS
========================================================= */

function setupKeyboardShortcuts() {

  document.addEventListener(
    "keydown",
    event => {

      /*
       * Don't trigger shortcuts
       * while typing.
       */

      const tag =
        event.target.tagName
          .toLowerCase();


      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select"
      ) {
        return;
      }


      /*
       * N = new task
       */

      if (
        event.key.toLowerCase() === "n"
      ) {

        addTask();

      }

    }
  );
  }
