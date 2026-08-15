/* =========================================================
   AI PLS — MAIN JAVASCRIPT
   Personal Learning System
   ========================================================= */

"use strict";


/* =========================================================
   01. DOM READY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initNavigation();
  initSmoothScroll();
  initRevealAnimations();
  initDashboardInteractions();
  initButtonInteractions();
  initKeyboardAccessibility();

});


/* =========================================================
   02. NAVIGATION
   ========================================================= */

function initNavigation() {

  const navbar = document.querySelector(".navbar");

  if (!navbar) return;


  /* Add shadow when scrolling */

  const updateNavbar = () => {

    if (window.scrollY > 20) {

      navbar.classList.add("navbar-scrolled");

    } else {

      navbar.classList.remove("navbar-scrolled");

    }

  };


  window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
  );


  updateNavbar();

}


/* =========================================================
   03. SMOOTH SCROLL
   ========================================================= */

function initSmoothScroll() {

  const links =
    document.querySelectorAll('a[href^="#"]');


  links.forEach(link => {

    link.addEventListener("click", event => {

      const targetId =
        link.getAttribute("href");


      if (
        !targetId ||
        targetId === "#"
      ) {

        event.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

        return;
      }


      const target =
        document.querySelector(targetId);


      if (!target) return;


      event.preventDefault();


      const navbar =
        document.querySelector(".navbar");


      const navbarHeight =
        navbar
          ? navbar.offsetHeight + 25
          : 25;


      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;


      window.scrollTo({

        top: targetPosition,

        behavior: "smooth"

      });

    });

  });

}


/* =========================================================
   04. REVEAL ANIMATIONS
   ========================================================= */

function initRevealAnimations() {

  const elements =
    document.querySelectorAll(
      ".feature, .step-card, .ai-section, .section-heading"
    );


  if (!elements.length) return;


  /*
   * Don't run heavy animations
   * when the user prefers reduced motion.
   */

  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    elements.forEach(element => {

      element.style.opacity = "1";
      element.style.transform = "none";

    });

    return;

  }


  elements.forEach(element => {

    element.classList.add("reveal");


    element.style.opacity = "0";

    element.style.transform =
      "translateY(24px)";


    element.style.transition =
      "opacity 0.7s ease, transform 0.7s ease";

  });


  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;


          entry.target.style.opacity = "1";

          entry.target.style.transform =
            "translateY(0)";


          observer.unobserve(
            entry.target
          );

        });

      },

      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }

    );


  elements.forEach(element => {

    observer.observe(element);

  });

}


/* =========================================================
   05. DASHBOARD INTERACTIONS
   ========================================================= */

function initDashboardInteractions() {

  const dashboard =
    document.querySelector(
      ".dashboard-preview"
    );


  if (!dashboard) return;


  /*
   * Desktop 3D movement
   */

  const isTouchDevice =
    window.matchMedia(
      "(hover: none)"
    ).matches;


  if (isTouchDevice) return;


  dashboard.addEventListener(
    "mousemove",
    event => {

      const rect =
        dashboard.getBoundingClientRect();


      const x =
        event.clientX - rect.left;


      const y =
        event.clientY - rect.top;


      const centerX =
        rect.width / 2;


      const centerY =
        rect.height / 2;


      const rotateY =
        ((x - centerX) / centerX) * 3;


      const rotateX =
        ((centerY - y) / centerY) * 2;


      dashboard.style.transform =
        `
        perspective(1100px)
        rotateY(${rotateY}deg)
        rotateX(${rotateX}deg)
        translateY(-4px)
        `;

    }
  );


  dashboard.addEventListener(
    "mouseleave",
    () => {

      dashboard.style.transform =
        `
        perspective(1100px)
        rotateY(-5deg)
        rotateX(2deg)
        `;

    }
  );

}


/* =========================================================
   06. BUTTON INTERACTIONS
   ========================================================= */

function initButtonInteractions() {

  const buttons =
    document.querySelectorAll(
      ".primary-btn, .secondary-btn, .nav-cta"
    );


  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        /*
         * Small visual feedback
         */

        button.classList.add(
          "button-clicked"
        );


        setTimeout(() => {

          button.classList.remove(
            "button-clicked"
          );

        }, 180);

      }
    );

  });

}


/* =========================================================
   07. FEATURE CARD INTERACTION
   ========================================================= */

function initFeatureCards() {

  const cards =
    document.querySelectorAll(
      ".feature"
    );


  cards.forEach(card => {

    card.addEventListener(
      "mouseenter",
      () => {

        card.style.zIndex = "2";

      }
    );


    card.addEventListener(
      "mouseleave",
      () => {

        card.style.zIndex = "1";

      }
    );

  });

}


/* =========================================================
   08. STEP CARD INTERACTION
   ========================================================= */

function initStepCards() {

  const cards =
    document.querySelectorAll(
      ".step-card"
    );


  cards.forEach(card => {

    card.addEventListener(
      "mouseenter",
      () => {

        card.classList.add(
          "step-active"
        );

      }
    );


    card.addEventListener(
      "mouseleave",
      () => {

        card.classList.remove(
          "step-active"
        );

      }
    );

  });

}


/* =========================================================
   09. KEYBOARD ACCESSIBILITY
   ========================================================= */

function initKeyboardAccessibility() {

  document.addEventListener(
    "keydown",
    event => {

      /*
       * Escape closes future
       * overlays / menus.
       */

      if (event.key === "Escape") {

        document.body.classList.remove(
          "menu-open"
        );

      }

    }
  );

}


/* =========================================================
   10. ACTIVE SECTION TRACKING
   ========================================================= */

function initActiveSectionTracking() {

  const sections =
    document.querySelectorAll(
      "section[id]"
    );


  const navLinks =
    document.querySelectorAll(
      '.nav-links a[href^="#"]'
    );


  if (
    !sections.length ||
    !navLinks.length
  ) return;


  const observer =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;


          const id =
            entry.target.getAttribute(
              "id"
            );


          navLinks.forEach(link => {

            link.classList.remove(
              "active"
            );


            if (
              link.getAttribute("href") ===
              `#${id}`
            ) {

              link.classList.add(
                "active"
              );

            }

          });

        });

      },

      {
        threshold: 0.35
      }

    );


  sections.forEach(section => {

    observer.observe(section);

  });

}


/* =========================================================
   11. PERFORMANCE SAFE INIT
   ========================================================= */

function initAdvancedInteractions() {

  initFeatureCards();
  initStepCards();
  initActiveSectionTracking();

}


/* =========================================================
   12. INITIALIZE ADVANCED FEATURES
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initAdvancedInteractions
);


/* =========================================================
   13. AI PLS UTILITIES
   ========================================================= */

/*
 * Simple utility for future modules.
 *
 * We will later use these functions for:
 *
 * - AI Chat
 * - Study Planner
 * - Quiz Generator
 * - Progress Tracking
 * - File Processing
 * - User Dashboard
 */


/**
 * Safely select an element.
 *
 * @param {string} selector
 * @returns {Element|null}
 */

function $(selector) {

  return document.querySelector(
    selector
  );

}


/**
 * Select multiple elements.
 *
 * @param {string} selector
 * @returns {NodeList}
 */

function $$(selector) {

  return document.querySelectorAll(
    selector
  );

}


/**
 * Create a DOM element.
 *
 * @param {string} tag
 * @param {string} className
 * @param {string} text
 * @returns {HTMLElement}
 */

function createElement(
  tag,
  className = "",
  text = ""
) {

  const element =
    document.createElement(tag);


  if (className) {

    element.className =
      className;

  }


  if (text) {

    element.textContent =
      text;

  }


  return element;

}


/* =========================================================
   14. AI PLS APP STATE
   ========================================================= */

const AI_PLS = {

  version: "1.0.0",

  appName: "AI PLS",

  user: null,

  initialized: true,

  settings: {

    theme: "dark",

    language: "ar",

    direction: "rtl"

  },

  features: {

    aiAssistant: true,

    studyPlanner: true,

    smartTests: true,

    progressTracking: true,

    fileAnalysis: false

  }

};


/* =========================================================
   15. GLOBAL ERROR HANDLING
   ========================================================= */

window.addEventListener(
  "error",
  event => {

    console.error(
      "AI PLS Error:",
      event.error || event.message
    );

  }
);


/* =========================================================
   16. APP READY
   ========================================================= */

window.addEventListener(
  "load",
  () => {

    document.body.classList.add(
      "app-ready"
    );


    console.log(
      "%cAI PLS",
      "font-size:24px;font-weight:800;"
    );


    console.log(
      "Personal Learning System initialized."
    );

  }
);
