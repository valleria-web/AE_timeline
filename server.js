// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import App from "./src/controllers/App.js";
import SearchService from "./src/searchService/SearchService.js";

// __dirname compatible con ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Servir archivos estáticos desde "public"
app.use(express.static(path.join(__dirname, "public")));

// Inicializa datos (timeline, participantes, awards)
const { timeline, participants, awards } = new App().init();

const data = {
  years: timeline.getYears(),
  participants,
  awards,
};

// Serializa arrays de modelos para evitar ciclos y estructuras no planas
function serialize(arr) {
  return arr.map((o) => (typeof o.getData === "function" ? o.getData() : o));
}

// Crea los arrays planos para SearchService
const searchService = new SearchService({
  years: data.years,
  events: data.years.flatMap((y) => y.events),
  participants: data.participants,
  awards: data.awards,
});

// Endpoint para búsqueda avanzada
app.get("/api/search", (req, res) => {
  const query = req.query.query || req.query.q || "";
  const type = req.query.type || "";

  const result = searchService.searchAll(query);

  let filtered;
  if (type === "year") {
    filtered = { years: serialize(result.years) };

  } else if (type === "event") {
    // Agrupa los eventos encontrados por año
    const eventos = serialize(result.events);
    const grouped = {};
    eventos.forEach((evt) => {
      const y = String(evt.year).trim();
      if (!grouped[y]) grouped[y] = { year: y, events: [] };
      grouped[y].events.push(evt);
    });
    filtered = { years: Object.values(grouped) };

  } else if (type === "participant") {
    // Devuelve directamente los participantes completos (no agrupados por años)
    filtered = { participants: serialize(result.participants) };

  } else if (type === "award") {
    const premios = serialize(result.awards);
    const grouped = {};

    premios.forEach((award) => {
      const y = String(award.year).trim();
      if (!grouped[y]) grouped[y] = { year: y, events: [], awards: [] };
      grouped[y].awards.push(award);
    });

    // Solo agrega eventos donde al menos un participante ganó el award
    data.years.forEach((y) => {
      const k = String(y.year).trim();
      if (grouped[k]) {
        // Busca los slugs de los ganadores de los premios filtrados de este año
        const winnerSlugs = grouped[k].awards.flatMap(a => (a.winners || []).map(w => w.slug));
        // Solo eventos donde algún participante es ganador de estos premios
        grouped[k].events = y.events
          .map(ev => (typeof ev.getData === "function" ? ev.getData() : ev))
          .filter(ev => (ev.participants || []).some(p => winnerSlugs.includes(p.slug)));
      }
    });

    filtered = { years: Object.values(grouped) };

  } else {
    // Búsqueda general: serializa todos los arrays
    filtered = {};
    for (const key in result) {
      filtered[key] = serialize(result[key]);
    }
  }

  res.json(filtered);
});

// Endpoint para la data inicial de la timeline
app.get("/api/timeline", (_req, res) => {
  res.json({
    years: serialize(data.years),
    participants: serialize(data.participants),
    awards: serialize(data.awards),
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});