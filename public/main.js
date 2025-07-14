import TimelineView from "./js/TimelineView.js";
import EventView from "./js/EventView.js";
import ParticipantView from "./js/ParticipantView.js";
// Si luego creas AwardView, igual aquí

let timelineData = null;
let timelineView = null;
let eventView = null;
let participantView = null;
let lastSearchId = 0;

async function bootstrap() {
  const res = await fetch("/api/timeline");
  const data = await res.json();
  timelineData = data;
  const root = document.getElementById("timeline-root");

  timelineView = new TimelineView(root);
  eventView = new EventView(root);
  participantView = new ParticipantView(root);

  timelineView.render(timelineData);

  const form = document.getElementById("search-form");
  form.addEventListener("submit", handleSearch);
}

async function handleSearch(event) {
  event.preventDefault();

  const type = document.getElementById("search-type").value;
  const queryRaw = document.getElementById("search-query").value.trim();

  if (!queryRaw) {
    timelineView.render(timelineData);
    return;
  }

  const searchId = ++lastSearchId;

  try {
    const url = `/api/search?type=${encodeURIComponent(type)}&query=${encodeURIComponent(queryRaw)}`;
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

    // View dinámica según búsqueda
    if (type === "event") {
      eventView.render(filtered);
    } else if (type === "participant") {
      participantView.render(filtered);
    } else {
      timelineView.render(filtered); // "year", "award", o cualquier otro
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

bootstrap();