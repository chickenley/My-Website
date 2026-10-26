/* Interactive details for the Design System Showcase */
const copyStatus = document.querySelector("#copy-status");
const demoStatus = document.querySelector("#demo-status");

// Copy a color swatch's HEX value when supported by the browser.
document.querySelectorAll(".swatch").forEach((swatch) => {
  swatch.addEventListener("click", async () => {
    const color = swatch.dataset.color;   
    try {
      await navigator.clipboard.writeText(color);
      copyStatus.textContent = `${color} copied to clipboard!`;
    } catch (error) {
      // Clipboard access may require HTTPS or localhost; still show the value.
      copyStatus.textContent = `Selected ${color} — copy it manually if needed.`;
    }
  });
});

// Demonstration controls: show feedback instead of pretending to submit data.
document.querySelectorAll("[data-demo]").forEach((button) => {
  button.addEventListener("click", () => {
    demoStatus.textContent = `You clicked: ${button.dataset.demo}. This is a demo component.`;
  });
});

// Mobile navigation toggle.
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Toggle navigation");
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Toggle navigation");
    menuToggle.textContent = "☰";
  });
});

// Reveal sections as they enter the viewport, with a reduced-motion fallback.
const revealTargets = document.querySelectorAll(
  ".system-panel, .sample-card, .type-card, .component-demo, .about-card, .career-step, .reflection"
);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  revealTargets.forEach((element) => element.classList.add("reveal"));
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((element) => observer.observe(element));
}


const flower = document.querySelector(".flower-cursor");

if (flower) {
  document.addEventListener("mousemove", (event) => {
    flower.style.left = `${event.clientX}px`;
    flower.style.top = `${event.clientY}px`;
  });
}

const head = document.querySelector(".head-cursor");
const pupilL = head ? head.querySelector(".eye-left .pupil") : null;
const pupilR = head ? head.querySelector(".eye-right .pupil") : null;

if (head) {
  // Set initial position
  head.style.left = "24px";
  head.style.top = "50%";
  head.style.right = "auto";
  head.style.transform = "translateY(-50%)";

  const eyeRange = 3;

  // Eyes track the cursor.
  document.addEventListener("mousemove", (event) => {
    const headRect = head.getBoundingClientRect();
    const headCenterX = headRect.left + headRect.width / 2;
    const headCenterY = headRect.top + headRect.height / 2;

    // Calculate angle from head center to cursor
    const dx = event.clientX - headCenterX;
    const dy = event.clientY - headCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.max(window.innerWidth, window.innerHeight) * 0.5;

    // Scale movement by distance (closer cursor = bigger eye movement)
    const scale = Math.min(1, distance / maxDist);
    const moveX = (dx / distance) * eyeRange * scale;
    const moveY = (dy / distance) * eyeRange * scale;

    if (pupilL) { pupilL.style.transform = `translate(${moveX}px, ${moveY}px)`; }
    if (pupilR) { pupilR.style.transform = `translate(${moveX}px, ${moveY}px)`; }
  });

  // Nod continuously while hovering a link, stop when leaving.
  const links = document.querySelectorAll('a[href]');
  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      head.classList.add("nodding");
    });
    link.addEventListener("mouseleave", () => {
      head.classList.remove("nodding");
    });
  });

  // Teleport to a random position when the cursor passes over the head.
  head.addEventListener("mouseenter", () => {
    const maxX = window.innerWidth - head.offsetWidth - 40;
    const maxY = window.innerHeight - head.offsetHeight - 40;
    const x = Math.random() * maxX + 20;
    const y = Math.random() * maxY + 20;
    head.style.left = `${x}px`;
    head.style.top = `${y}px`;
    head.style.right = "auto";
    head.style.transform = "translateY(-50%)";
  });

  // Also teleport on click/touch.
  head.addEventListener("click", () => {
    const maxX = window.innerWidth - head.offsetWidth - 40;
    const maxY = window.innerHeight - head.offsetHeight - 40;
    const x = Math.random() * maxX + 20;
    const y = Math.random() * maxY + 20;
    head.style.left = `${x}px`;
    head.style.top = `${y}px`;
    head.style.right = "auto";
    head.style.transform = "translateY(-50%)";
  });
}

// Light / dark theme toggle with a wave ripple effect.
const themeToggle = document.querySelector("#theme-toggle");
const root = document.documentElement;
const body = document.body;

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  root.setAttribute("data-theme", "light");
}

themeToggle.addEventListener("click", (event) => {
  const current = root.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";

  // Position the ripple at the toggle button.
  const rect = themeToggle.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  body.style.setProperty("--ripple-x", `${x}px`);
  body.style.setProperty("--ripple-y", `${y}px`);

  // Ripple color: purple when going dark, white when going light.
  body.style.setProperty("--ripple-color",
    next === "dark"
      ? "rgba(155, 120, 255, 0.35)"
      : "rgba(255, 255, 255, 0.5)"
  );

  // Trigger the ripple animation.
  body.classList.remove("ripple-active");
  void body.offsetWidth; // force reflow
  body.classList.add("ripple-active");

  // Apply the new theme at the same time as the wave.
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});
