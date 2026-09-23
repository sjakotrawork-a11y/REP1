import "./style.css";
import "./reference-refinement.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    category: "OPERATIONAL INTELLIGENCE",
    overline: "CLARITY IN EVERY LINE ITEM",
    title: "RA Bill & BOQ",
    accent: "Reconciliation.",
    description:
      "Turn complex billing documents into a clear picture. Cross-check quantities, rates, and variations before they become costly oversights.",
    tags: ["Document intelligence", "Claude"],
    image: "/media/reconciliation.jpg",
    time: 4.5,
    progress: 0.15,
    tools: ["Claude"],
    context:
      "Running-account bills bring together quantities, rates, work orders, and measurements. Checking each document in isolation makes discrepancies difficult to follow.",
    solution:
      "Bring the RA bill, bill of quantities, work order, and measurement records into one structured review. Highlight mismatches with the supporting source information, ready for a person to verify.",
    outputs: [
      "Quantity and rate discrepancies organised by package",
      "A structured comparison of billed and approved items",
      "A review-ready discrepancy report with supporting references",
    ],
    note: "Use case shown in the supplied reference. AI-assisted checks support the reviewer; payment and approval decisions remain with the responsible team.",
  },
  {
    category: "ARCHITECTURAL INTELLIGENCE",
    overline: "FROM LINES TO POSSIBILITIES",
    title: "Floor Plan to 3D",
    accent: "Render",
    description:
      "Make the leap from a technical plan to a space you can understand. Bring layouts, volumes, and architectural ideas into a shared visual language.",
    tags: ["Plan to perspective", "Design communication"],
    image: "/media/architecture.jpg",
    time: 19,
    progress: 0.36,
    tools: ["OpenAI", "Google Drive"],
    context:
      "A floor plan contains a great deal of information, but it does not always communicate a building’s scale, depth, or character to every stakeholder.",
    solution:
      "Use visual storytelling to connect the two-dimensional plan with an architectural perspective. The supplied film illustrates this progression from drawing to three-dimensional form.",
    outputs: [
      "A visual narrative from plan to building form",
      "Clearer conversations around spatial relationships",
      "Presentation material for design discussions",
    ],
    note: "Visualisation illustrated by the supplied film. Concept imagery is not a substitute for approved architectural or engineering drawings.",
  },
  {
    category: "SPATIAL INTELLIGENCE",
    overline: "SEE WHAT A SPACE COULD BECOME",
    title: "Interior",
    accent: "Transformation.",
    description:
      "Give an empty room a sense of possibility. Explore material, mood, and furnishing to help people connect with a space before they step inside.",
    tags: ["Interior concepts", "Visual storytelling"],
    image: "/media/interior.jpg",
    time: 44,
    progress: 0.69,
    tools: ["OpenAI"],
    context:
      "An unfinished or unfurnished space leaves much to the imagination. Buyers and project teams benefit from a tangible view of its potential.",
    solution:
      "Present a considered progression from empty interior to furnished concept. Natural textures, lighting, and spatial composition create a clear visual direction.",
    outputs: [
      "An interior concept grounded in the space",
      "A visual exploration of materials and atmosphere",
      "A before-and-after story for presentations",
    ],
    note: "Concept transformation shown in the supplied footage. Furniture, finishes, and architectural details are illustrative and should be validated against project specifications.",
  },
  {
    category: "BRAND INTELLIGENCE",
    overline: "TURN A PROPERTY INTO A STORY",
    title: "Property",
    accent: "Storytelling.",
    description:
      "Bring the complete vision together. Create a compelling visual journey that connects a property’s character with the people who will call it home.",
    tags: ["Property marketing", "Cinematic content"],
    image: "/media/estate-hero.jpg",
    time: 59,
    progress: 0.90,
    tools: ["OpenAI", "Google Drive"],
    context:
      "A property deserves more than a disconnected set of images. Its setting, architecture, interiors, and atmosphere should work together as a story.",
    solution:
      "Combine the strongest moments into a coherent property narrative, moving from architectural detail to the experience of living in the space.",
    outputs: [
      "A connected narrative for the property",
      "Cinematic visual content for the showcase",
      "A consistent direction for digital presentations",
    ],
    note: "Marketing direction illustrated by the supplied film. No campaign performance or sales results are claimed.",
  },
];

const video = document.querySelector(".journey-video");
const journey = document.querySelector(".journey");
const stage = document.querySelector(".journey-stage");
const chapterButtons = [...document.querySelectorAll(".chapter")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeChapter = 0;
let scrollProgress = 0;
let desiredTime = 0;
let scrubFrame = 0;
let journeyTrigger;

// Hold the paper opening briefly, then follow the original film continuously.
function timeAtProgress(progress) {
  const timeScale = Number.isFinite(video.duration) ? video.duration / 68.54 : 1;
  const stops = [
    [0, 0],
    [0.02, 0],
    [0.07, 3 * timeScale],
    [0.12, 5 * timeScale],
    [0.27, 9 * timeScale],
    [0.60, 38 * timeScale],
    [0.82, 54 * timeScale],
    [1, video.duration - 0.12],
  ];
  for (let i = 1; i < stops.length; i++) {
    if (progress <= stops[i][0]) {
      const [p0, t0] = stops[i - 1];
      const [p1, t1] = stops[i];
      return t0 + ((t1 - t0) * (progress - p0)) / (p1 - p0);
    }
  }
  return video.duration - 0.12;
}

function seekVideo() {
  scrubFrame = 0;
  if (video.readyState < 1 || video.seeking || !Number.isFinite(video.duration))
    return;
  const target = Math.min(desiredTime, Math.max(0, video.duration - 0.08));
  if (Math.abs(video.currentTime - target) > 0.065) video.currentTime = target;
}
function queueSeek(time) {
  desiredTime = time;
  if (!scrubFrame) scrubFrame = requestAnimationFrame(seekVideo);
}
video.addEventListener("seeked", () => {
  if (Math.abs(video.currentTime - desiredTime) > 0.08 && !scrubFrame)
    scrubFrame = requestAnimationFrame(seekVideo);
});
video.addEventListener("loadedmetadata", () =>
  queueSeek(timeAtProgress(scrollProgress)),
);
if (video.readyState >= 1) queueSeek(timeAtProgress(scrollProgress));
video.addEventListener("error", () => {
  video.poster = chapters[activeChapter].image;
});

const panel = document.querySelector(".case-panel");
function drawFolder() {
  const w = panel.offsetWidth - 1, h = panel.offsetHeight - 1;
  const tab = document.querySelector(".case-top");
  const y = tab.offsetHeight - 12, tw = Math.min(tab.offsetWidth + 8, w - 45);
  const r = w < 500 ? 28 : 40, n = 20;
  const d = `M ${r} 1 H ${tw-n} Q ${tw} 1 ${tw} ${n} V ${y-n} Q ${tw} ${y} ${tw+n} ${y} H ${w-r} Q ${w} ${y} ${w} ${y+r} V ${h-r} Q ${w} ${h} ${w-r} ${h} H ${r} Q 1 ${h} 1 ${h-r} V ${r} Q 1 1 ${r} 1 Z`;
  document.querySelector(".folder-outline path").setAttribute("d",d);
  document.querySelector(".folder-glass").style.clipPath = `path("${d}")`;
  document.querySelector(".folder-glass").style.borderRadius = "0";
}
const folderObserver = new ResizeObserver(drawFolder);
folderObserver.observe(panel);
function setChapter(index, animate = true) {
  if (
    index === activeChapter &&
    document.querySelector("#case-title").dataset.ready
  )
    return;
  activeChapter = index;
  const chapter = chapters[index];
  const content = document.querySelector(".case-content");
  document.querySelector("#case-title").textContent = `${chapter.title} ${chapter.accent.replace(/\.$/, "")}`;
  document.querySelector("#case-title").dataset.ready = "true";
  const icons = { Claude: "claude.webp", OpenAI: "openai.svg", "Google Drive": "google-drive.svg" };
  document.querySelector("#case-tools").innerHTML = chapter.tools.map(name => `<span class="tool-bubble"><img src="/media/${icons[name]}" alt="${name}" /></span>`).join("");
  drawFolder();
  stage.dataset.chapter = index;
  if (reducedMotion.matches || video.error) video.poster = chapter.image;
  if (animate && !reducedMotion.matches)
    gsap.fromTo(
      content,
      { opacity: 0.35, y: 9 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", overwrite: true },
    );
}
setChapter(0, false);

const motion = gsap.matchMedia();
motion.add("(prefers-reduced-motion: no-preference)", () => {
  gsap.set([...panel.children], {opacity:0});
  gsap.from(".landing-content > *", {
    opacity: 0,
    y: 22,
    duration: 1,
    stagger: 0.12,
    ease: "power2.out",
    delay: 0.15,
  });
  let overlayVisible = false;
  const overlays = [panel];
  function updateOpening(progress) {
    const fade = Math.min(1, progress / 0.045);
    gsap.set(".landing-content,.landing-scroll", { autoAlpha: 1-fade });
    const show = progress > .085;
    if (show !== overlayVisible) {
      overlayVisible = show;
      overlays.forEach(el => { el.inert = !show; el.setAttribute("aria-hidden",String(!show)); });
      gsap.to(overlays.filter(el=>el!==panel), {autoAlpha: show ? 1 : 0, duration: .5, ease: "power2.inOut", overwrite: true});
      if(show) panel.style.visibility="visible";
      gsap.to([...panel.children], {opacity:show?1:0,duration:.5,ease:"power2.inOut",overwrite:true,onComplete:()=>{if(!show)panel.style.visibility="hidden";}});
      gsap.to(".journey-wash", {opacity: show ? 1 : 0, duration:.5});
    }
  }
  gsap.utils.toArray(".reveal").forEach((element) => {
    gsap.from(element, {
      opacity: 0,
      y: 25,
      duration: 0.85,
      ease: "power2.out",
      scrollTrigger: { trigger: element, start: "top 92%", once: true },
    });
  });
  journeyTrigger = ScrollTrigger.create({
    trigger: journey,
    start: "top top",
    end: "bottom bottom",
    onUpdate(self) {
      scrollProgress = self.progress;
      updateOpening(self.progress);
      const index =
        self.progress < 0.27
          ? 0
          : self.progress < 0.60
            ? 1
            : self.progress < 0.82
              ? 2
              : 3;
      setChapter(index);
      if (Number.isFinite(video.duration))
        queueSeek(timeAtProgress(self.progress));
    },
  });
  updateOpening(journeyTrigger.progress);
  return () => {
    journeyTrigger = undefined;
  };
});
motion.add("(prefers-reduced-motion: reduce)", () => {
  panel.inert = false;
  panel.setAttribute("aria-hidden","false");
});
document.querySelector("[data-start]").addEventListener("click", () => {
  if (!journeyTrigger) return;
  window.scrollTo({
    top: journeyTrigger.start + (journeyTrigger.end - journeyTrigger.start) * chapters[0].progress,
    behavior: reducedMotion.matches ? "auto" : "smooth",
  });
});

// Keep the native dialog semantics, keyboard focus trap, and Escape-to-close behavior.
let opener;
function openDialog(dialog, trigger) {
  opener = trigger || document.activeElement;
  dialog.showModal();
  document.body.classList.add("dialog-open");
}
document.querySelectorAll("dialog").forEach((dialog) => {
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (dialog.id === "film-dialog") dialog.querySelector("video").pause();
    opener?.focus({ preventScroll: true });
  });
});
const caseDialog = document.querySelector("#case-dialog");
document.querySelector("#case-open").addEventListener("click", (event) => {
  const chapter = chapters[activeChapter];
  document.querySelector("#detail-content").innerHTML = `
    <p class="eyebrow">${String(activeChapter + 1).padStart(2, "0")} / ${chapter.category}</p>
    <h2>${chapter.title}<br /><em>${chapter.accent}</em></h2>
    <img src="${chapter.image}" alt="${chapter.title} ${chapter.accent} visual from the supplied showcase film" />
    <h3>The challenge</h3><p>${chapter.context}</p>
    <h3>The approach</h3><p>${chapter.solution}</p>
    <h3>What it brings together</h3><ul>${chapter.outputs.map((item) => `<li>${item}</li>`).join("")}</ul>
    <p class="detail-note">${chapter.note}</p>
    <button class="button button-dark" id="detail-brief">Explore a similar project <span aria-hidden="true">↗</span></button>`;
  document.querySelector("#detail-brief").addEventListener("click", (event) => {
    caseDialog.close();
    const interest = document.querySelector('[name="interest"]');
    interest.selectedIndex = activeChapter;
    openDialog(
      document.querySelector("#brief-dialog"),
      document.querySelector("#case-open"),
    );
  });
  openDialog(caseDialog, event.currentTarget);
});
document.querySelectorAll("[data-film]").forEach((button) =>
  button.addEventListener("click", () => {
    const dialog = document.querySelector("#film-dialog");
    openDialog(dialog, button);
    dialog
      .querySelector("video")
      .play()
      .catch(() => {
        /* Native controls remain available. */
      });
  }),
);
document
  .querySelectorAll("[data-brief]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      openDialog(document.querySelector("#brief-dialog"), button),
    ),
  );
document.querySelector("#brief-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const brief = `ESTATE INTELLIGENCE — PROJECT BRIEF\n\nName: ${data.get("name").trim()}\nCompany: ${data.get("company").trim()}\nArea of interest: ${data.get("interest")}\n\nProject context\n${data.get("message").trim() || "To be discussed."}\n\nCreated locally on ${new Date().toLocaleDateString("en-GB")}. No information has been submitted online.\n`;
  const url = URL.createObjectURL(
    new Blob([brief], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "estate-intelligence-project-brief.txt";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  event.currentTarget.querySelector(".form-note").textContent =
    "Your brief has been downloaded. Share it with your team when you’re ready. Nothing was submitted online.";
});

document.fonts.ready.then(() => {drawFolder(); ScrollTrigger.refresh();});
window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
