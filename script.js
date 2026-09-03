const header = document.querySelector("[data-header]");
const galleryItems = Array.from(document.querySelectorAll("[data-gallery-index]"));
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const closeButton = document.querySelector("[data-lightbox-close]");
const prevButton = document.querySelector("[data-lightbox-prev]");
const nextButton = document.querySelector("[data-lightbox-next]");

let activeGalleryIndex = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function updateHeader() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 24);
}

function updateLightbox() {
  const item = galleryItems[activeGalleryIndex];
  const image = item?.querySelector("img");
  if (!image || !lightboxImage || !lightboxCaption) return;

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = `${activeGalleryIndex + 1} / ${galleryItems.length}`;
}

function openLightbox(index) {
  if (!lightbox || galleryItems.length === 0) return;

  activeGalleryIndex = index;
  updateLightbox();
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  closeButton?.focus();
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  galleryItems[activeGalleryIndex]?.focus();
}

function showGalleryImage(direction) {
  activeGalleryIndex = (activeGalleryIndex + direction + galleryItems.length) % galleryItems.length;
  updateLightbox();
}

function handleLightboxSwipe() {
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;
  const isHorizontalSwipe = Math.abs(diffX) > 48 && Math.abs(diffX) > Math.abs(diffY) * 1.25;

  if (!isHorizontalSwipe) return;
  showGalleryImage(diffX > 0 ? -1 : 1);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

closeButton?.addEventListener("click", closeLightbox);
prevButton?.addEventListener("click", () => showGalleryImage(-1));
nextButton?.addEventListener("click", () => showGalleryImage(1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox?.addEventListener("touchstart", (event) => {
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

lightbox?.addEventListener("touchend", (event) => {
  const touch = event.changedTouches[0];
  touchEndX = touch.clientX;
  touchEndY = touch.clientY;
  handleLightboxSwipe();
}, { passive: true });

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("is-open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showGalleryImage(-1);
  if (event.key === "ArrowRight") showGalleryImage(1);
});
