import TimelineView from "./js/TimelineView.js";
import EventView from "./js/EventView.js";
import ParticipantView from "./js/ParticipantView.js";
import AwardView from "./js/AwardView.js";

const typeLabels = {
  sapientiae: "Premio Sapientiae",
  embajador: "Embajador de la Paz",
  dhc: "Doctor Honoris Causa",
  maestro: "Maestro Ad Vitam",
  pax: "Pax Magister",
};

let timelineData = null;
let timelineView = null;
let eventView = null;
let participantView = null;
let awardView = null;
let lastSearchId = 0;

// Función utilitaria para el botón volver
function getVolverBtn() {
  return `<button id="volver-btn" style="margin-top:2rem;">Volver</button>`;
}

async function bootstrap() {
  const res = await fetch("/api/timeline");
  const data = await res.json();
  timelineData = data;
  const root = document.getElementById("timeline-root");

  timelineView = new TimelineView(root);
  eventView = new EventView(root);
  participantView = new ParticipantView(root);
  awardView = new AwardView(root);

  timelineView.render(timelineData);

  const form = document.getElementById("search-form");
  form.addEventListener("submit", handleSearch);

  const searchType = document.getElementById("search-type");
  const awardSubmenu = document.getElementById("award-type-submenu");

  // Mostrar/ocultar submenu de premios
  searchType.addEventListener("change", function () {
    if (this.value === "award") {
      awardSubmenu.style.display = "inline-block";
    } else {
      awardSubmenu.style.display = "none";
      awardSubmenu.value = "";
    }
  });

  // Inicializa router SPA
  window.addEventListener("hashchange", handleRouteChange);
  window.addEventListener("DOMContentLoaded", handleRouteChange);
}

async function handleSearch(event) {
  event.preventDefault();

  const type = document.getElementById("search-type").value;
  const queryRaw = document.getElementById("search-query").value.trim();
  const awardType = document.getElementById("award-type-submenu").value;

  const searchId = ++lastSearchId;

  // Caso 1: busca general, sin texto, excepto award
  if (!queryRaw && type !== "award") {
    window.location.hash = ""; // Reset router
    timelineView.render(timelineData);
    return;
  }

  // Caso 2: busca todos los premios de cierto tipo sin texto
  if (type === "award" && !queryRaw && awardType) {
    let url = `/api/search?type=award&query=&awardType=${encodeURIComponent(
      awardType
    )}`;
    try {
      const res = await fetch(url);
      if (searchId !== lastSearchId) return;
      if (!res.ok) {
        showNoResults();
        return;
      }
      const filtered = await res.json();
      if (searchId !== lastSearchId) return;
      if (isEmptyResult(filtered)) {
        showNoResults();
        return;
      }
      awardView.render(filtered, awardType);
    } catch (e) {
      alert("Hubo un problema con la búsqueda");
      console.error(e);
    }
    return;
  }

  // Caso 3: búsqueda normal (por texto y/o tipo)
  let url = `/api/search?type=${encodeURIComponent(
    type
  )}&query=${encodeURIComponent(queryRaw)}`;
  if (type === "award" && awardType) {
    url += `&awardType=${encodeURIComponent(awardType)}`;
  }
  try {
    const res = await fetch(url);
    if (searchId !== lastSearchId) return;
    if (!res.ok) {
      showNoResults();
      return;
    }
    const filtered = await res.json();
    if (searchId !== lastSearchId) return;
    if (isEmptyResult(filtered)) {
      showNoResults();
      return;
    }
    // Render según tipo
    if (type === "event") {
      eventView.render(filtered);
    } else if (type === "participant") {
      await participantView.render(filtered);
    } else if (type === "award") {
      awardView.render(filtered, awardType);
    } else {
      timelineView.render(filtered);
    }
  } catch (e) {
    alert("Hubo un problema con la búsqueda");
    console.error(e);
  }
}

function isEmptyResult(obj) {
  if (!obj) return true;
  if (Array.isArray(obj.years)) return obj.years.length === 0;
  if (Array.isArray(obj.events)) return obj.events.length === 0;
  if (Array.isArray(obj.participants)) return obj.participants.length === 0;
  if (Array.isArray(obj.awards)) return obj.awards.length === 0;
  return true;
}

function showNoResults() {
  const root = document.getElementById("timeline-root");
  root.innerHTML = `
    <div style="text-align:center; color:#555; margin:2rem 0;">
      <h2>No se encontraron resultados para tu búsqueda.</h2>
      <button onclick="window.location.reload()">Volver a ver todo</button>
    </div>
  `;
}

async function handleRouteChange() {
  const hash = window.location.hash || "";
  const root = document.getElementById("timeline-root");

  // Participante: #/participante/slug
  const participantMatch = hash.match(/^#\/participante\/(.+)/);
  if (participantMatch) {
    const slug = participantMatch[1];
    // Aquí usamos participantView.render, pero añadimos el botón "volver" después de renderizar
    await participantView.render({ participants: [{ slug }] });
    appendVolverBtn();
    return;
  }

  // Evento: #/evento/slug
  const eventMatch = hash.match(/^#\/evento\/(.+)/);
  if (eventMatch) {
    const slug = eventMatch[1];
    await eventView.render({ events: [{ slug }] });
    appendVolverBtn();
    return;
  }

  // Premio: #/premio/slug
  const awardMatch = hash.match(/^#\/premio\/(.+)/);
  if (awardMatch) {
    const slug = awardMatch[1];
    await awardView.render({ awards: [{ slug }] });
    appendVolverBtn();
    return;
  }

  // Año: #/year/2008
  const yearMatch = hash.match(/^#\/year\/(\d{4})/);
  if (yearMatch) {
    const year = yearMatch[1];
    try {
      const res = await fetch(`/api/year/${year}/md`);
      if (!res.ok) throw new Error("Año no encontrado");
      let md = await res.text();
      // Quita metadatos YAML (frontmatter)
      md = md.replace(/^\s*---[\s\S]*?---\s*/m, "");
      root.innerHTML = `
        <div class="year-md">
          ${window.marked ? marked.parse(md) : `<pre>${md}</pre>`}
          ${getVolverBtn()}
        </div>
      `;
      document.getElementById("volver-btn").onclick = () => {
        window.location.hash = "";
      };
    } catch (err) {
      root.innerHTML = "<p>No se encontró el año.</p>";
    }
    return;
  }

  // Default: renderiza Timeline normal
  if (timelineView && timelineData) {
    timelineView.render(timelineData);
  }
}

// Añade el botón volver si no está
function appendVolverBtn() {
  const root = document.getElementById("timeline-root");
  if (!document.getElementById("volver-btn")) {
    const btn = document.createElement("button");
    btn.id = "volver-btn";
    btn.textContent = "Volver";
    // Centramos el botón horizontalmente
    btn.style.display = "block";
    btn.style.margin = "2rem auto 0 auto";
    btn.onclick = () => {
      window.location.hash = "";
    };
    root.appendChild(btn);
  }
}

bootstrap();