const root = document.documentElement;
const languageToggle = document.querySelector("[data-language-toggle]");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const progress = document.querySelector(".scroll-progress span");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const paperEntries = [...document.querySelectorAll("[data-category]")];
const paperGroups = [...document.querySelectorAll("[data-group]")];
const resultsCount = document.querySelector("[data-results-count]");
const counts = { all: 22, published: 9, working: 13 };
let currentFilter = "all";

const updateResultsCount = () => {
  const count = counts[currentFilter];
  resultsCount.textContent = root.lang.startsWith("zh")
    ? "共 " + count + " 篇论文"
    : count + (count === 1 ? " paper" : " papers");
};

const applyLanguage = (language) => {
  const key = language === "zh" ? "zh" : "en";
  root.lang = key === "zh" ? "zh-CN" : "en";

  document.querySelectorAll("[data-en][data-zh]").forEach((element) => {
    element.textContent = element.dataset[key];
  });

  languageToggle.textContent = key === "zh" ? "EN" : "中文";
  languageToggle.setAttribute("aria-label", key === "zh" ? "Switch to English" : "切换为中文");
  document.title = key === "zh"
    ? "兰天旭｜能源经济与供应链"
    : "Tianxu Lan | Energy Economics & Supply Chains";
  updateResultsCount();

  try {
    localStorage.setItem("tianxu-site-language", key);
  } catch (_) {
    // Language persistence is optional.
  }
};

let initialLanguage = "en";
try {
  initialLanguage = localStorage.getItem("tianxu-site-language") || "en";
} catch (_) {
  initialLanguage = "en";
}
applyLanguage(initialLanguage);

languageToggle.addEventListener("click", () => {
  applyLanguage(root.lang.startsWith("zh") ? "en" : "zh");
});

const applyFilter = (filter) => {
  currentFilter = filter in counts ? filter : "all";

  filterButtons.forEach((button) => {
    const active = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  paperEntries.forEach((entry) => {
    entry.hidden = currentFilter !== "all" && entry.dataset.category !== currentFilter;
  });

  paperGroups.forEach((group) => {
    group.hidden = currentFilter !== "all" && group.dataset.group !== currentFilter;
  });

  updateResultsCount();
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter));
});

const setMenu = (open) => {
  navigation.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
};

menuToggle.addEventListener("click", () => {
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1020) setMenu(false);
});

const updateProgress = () => {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = available > 0 ? window.scrollY / available : 0;
  progress.style.width = Math.min(100, Math.max(0, ratio * 100)) + "%";
};

updateProgress();
window.addEventListener("scroll", updateProgress, { passive: true });

const navLinks = [...navigation.querySelectorAll("a[href^='#']")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === "#" + visible.target.id;
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-20% 0px -65%", threshold: [0.05, 0.2, 0.5] }
);

sections.forEach((section) => sectionObserver.observe(section));

document.querySelector("[data-year]").textContent = String(new Date().getFullYear());
