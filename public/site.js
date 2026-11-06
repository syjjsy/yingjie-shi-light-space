const root = document.documentElement;

function setLanguage(language) {
  root.dataset.language = language;
  root.lang = language === "zh" ? "zh-CN" : "en";
  try { localStorage.setItem("language", language); } catch {}
}

document.querySelectorAll("[data-language-toggle]").forEach((button) => {
  button.addEventListener("click", () => setLanguage(root.dataset.language === "zh" ? "en" : "zh"));
});

const menuButton = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menu?.classList.toggle("is-open", !open);
});
menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuButton?.setAttribute("aria-expanded", "false");
  menu?.classList.remove("is-open");
}));

const filterForm = document.querySelector("[data-publication-filters]");
if (filterForm) {
  const items = [...document.querySelectorAll("[data-publication]")];
  const count = document.querySelector("[data-result-count]");
  const apply = () => {
    const year = filterForm.querySelector("[name=year]")?.value || "all";
    const type = filterForm.querySelector("[name=type]")?.value || "all";
    let visible = 0;
    items.forEach((item) => {
      const show = (year === "all" || item.dataset.year === year) && (type === "all" || item.dataset.type === type);
      item.hidden = !show;
      visible += show ? 1 : 0;
    });
    if (count) count.textContent = String(visible);
  };
  filterForm.addEventListener("change", apply);
  apply();
}

document.querySelectorAll("[data-copy-bibtex]").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copyBibtex || "");
      const old = button.textContent;
      button.textContent = root.dataset.language === "zh" ? "已复制" : "Copied";
      setTimeout(() => { button.textContent = old; }, 1600);
    } catch {
      button.textContent = root.dataset.language === "zh" ? "复制失败" : "Copy failed";
    }
  });
});

const reveal = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  reveal.forEach((item) => observer.observe(item));
} else {
  reveal.forEach((item) => item.classList.add("is-visible"));
}

const lightbox = document.querySelector("[data-lightbox]");
const galleryItems = [...document.querySelectorAll("[data-gallery-item]")];
let activeIndex = -1;
let pointerStart = null;

function showLightbox(index) {
  if (!lightbox || !galleryItems.length) return;
  activeIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[activeIndex];
  const image = lightbox.querySelector("img");
  const title = lightbox.querySelector("[data-lightbox-title]");
  image.src = item.dataset.full || item.querySelector("img")?.src || "";
  image.alt = item.dataset.alt || "";
  if (title) title.textContent = item.dataset.title || "";
  lightbox.showModal();
}

galleryItems.forEach((item, index) => item.addEventListener("click", () => showLightbox(index)));
lightbox?.querySelector("[data-lightbox-close]")?.addEventListener("click", () => lightbox.close());
lightbox?.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => showLightbox(activeIndex - 1));
lightbox?.querySelector("[data-lightbox-next]")?.addEventListener("click", () => showLightbox(activeIndex + 1));
lightbox?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") showLightbox(activeIndex - 1);
  if (event.key === "ArrowRight") showLightbox(activeIndex + 1);
});
lightbox?.addEventListener("pointerdown", (event) => { pointerStart = event.clientX; });
lightbox?.addEventListener("pointerup", (event) => {
  if (pointerStart === null) return;
  const distance = event.clientX - pointerStart;
  if (Math.abs(distance) > 48) showLightbox(activeIndex + (distance < 0 ? 1 : -1));
  pointerStart = null;
});
