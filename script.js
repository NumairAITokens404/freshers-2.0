const section = document.querySelector("#memories");
const pin = document.querySelector("#memory-pin");
const viewport = document.querySelector("#rail-viewport");
const rail = document.querySelector("#rail");

const captions = [
  "The first hello",
  "Four steps into the night",
  "A room full of colour",
  "When the music took over",
  "Red lights, loud laughter",
  "A little magic on stage",
  "One for the album",
  "The people who made it",
  "Under the open sky",
  "The memories we keep",
  "Together, always",
];

captions.forEach((caption, index) => {
  const card = document.createElement("article");
  card.className = "card";
  card.innerHTML = `
    <div class="photo">
      <img
        src="public/images/timeline/memory-${String(index + 1).padStart(2, "0")}.jpeg"
        alt="${caption}"
        loading="${index < 3 ? "eager" : "lazy"}"
        decoding="async"
      />
    </div>
    <div class="copy"><p>${caption.toUpperCase()}</p></div>
  `;

  const image = card.querySelector("img");
  const setRatio = () => {
    if (image.naturalWidth && image.naturalHeight) {
      card.style.setProperty("--image-ratio", `${image.naturalWidth} / ${image.naturalHeight}`);
    }
  };
  image.addEventListener("load", setRatio);
  if (image.complete) setRatio();
  rail.append(card);

  if (index < captions.length - 1) {
    const branch = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    branch.setAttribute("class", `branch ${index % 2 === 0 ? "branch--pink" : "branch--lime"}`);
    branch.setAttribute("viewBox", "0 0 126 136");
    branch.setAttribute("aria-hidden", "true");
    branch.innerHTML = '<path d="M 0 8 C 48 4 20 67 62 68 C 104 69 112 18 78 24 C 41 31 49 113 126 128" />';
    rail.append(branch);
  }
});

let animationFrame = 0;

function travelDistance() {
  return Math.max(0, viewport.scrollWidth - viewport.clientWidth);
}

function updateGallery() {
  animationFrame = 0;
  const travel = travelDistance();
  const progress = Math.max(0, Math.min(travel, -section.getBoundingClientRect().top));
  viewport.scrollLeft = progress;
}

function scheduleUpdate() {
  if (!animationFrame) animationFrame = requestAnimationFrame(updateGallery);
}

function measureGallery() {
  section.style.height = `${pin.offsetHeight + travelDistance()}px`;
  updateGallery();
}

const resizeObserver = new ResizeObserver(measureGallery);
resizeObserver.observe(pin);
resizeObserver.observe(rail);
window.addEventListener("scroll", scheduleUpdate, { passive: true });
window.addEventListener("resize", measureGallery);

viewport.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  const direction = event.key === "ArrowRight" ? 1 : -1;
  const distance = Math.min(520, viewport.clientWidth * 0.82);
  window.scrollBy({ top: direction * distance, behavior: "smooth" });
});

measureGallery();
