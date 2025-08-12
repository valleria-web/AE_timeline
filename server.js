// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import App from "./src/controllers/App.js";
import SearchService from "./src/searchService/SearchService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

const { timeline, participants, awards } = new App().init();

const data = {
  years: timeline.getYears(),
  participants,
  awards,
};

function serialize(arr) {
  return arr.map((o) => (typeof o.getData === "function" ? o.getData() : o));
}

const searchService = new SearchService({
  years: data.years,
  events: data.years.flatMap((y) => y.events),
  participants: data.participants,
  awards: data.awards,
});

// Busca avançada
app.get("/api/search", (req, res) => {
  const query = req.query.query || req.query.q || "";
  const type = req.query.type || "";
  const awardType = req.query.awardType || null;

  let result;
  // Passa awardType explicitamente para busca de prêmio
  if (type === "award") {
    result = {
      awards: searchService.awardSearcher.search(query, awardType),
    };
  } else {
    result = searchService.searchAll(query);
  }

  let filtered;
  if (type === "year") {
    filtered = { years: serialize(result.years) };
  } else if (type === "event") {
    const eventos = serialize(result.events);
    const grouped = {};
    eventos.forEach((evt) => {
      const y = String(evt.year).trim();
      if (!grouped[y]) grouped[y] = { year: y, events: [] };
      grouped[y].events.push(evt);
    });
    filtered = { years: Object.values(grouped) };
  } else if (type === "participant") {
    filtered = { participants: serialize(result.participants) };
  } else if (type === "award") {
    const premios = serialize(result.awards);
    const grouped = {};

    premios.forEach((award) => {
      const y = String(award.year).trim();
      if (!grouped[y]) grouped[y] = { year: y, events: [], awards: [] };
      grouped[y].awards.push(award);
    });

    // Agrupa eventos por ano onde algum participante é ganhador de prêmio daquele ano
    data.years.forEach((y) => {
      const k = String(y.year).trim();
      if (grouped[k]) {
        const winnerSlugs = grouped[k].awards.flatMap((a) =>
          (a.winners || []).map((w) => w.slug)
        );
        grouped[k].events = y.events
          .map((ev) => (typeof ev.getData === "function" ? ev.getData() : ev))
          .filter((ev) =>
            (ev.participants || []).some((p) => winnerSlugs.includes(p.slug))
          );
      }
    });

    filtered = { years: Object.values(grouped) };
  } else {
    // Busca global padrão
    filtered = {};
    for (const key in result) {
      filtered[key] = serialize(result[key]);
    }
  }

  res.json(filtered);
});

app.get("/api/timeline", (_req, res) => {
  res.json({
    years: serialize(data.years),
    participants: serialize(data.participants),
    awards: serialize(data.awards),
  });
});

// Lê arquivos markdown de participante
app.get("/api/participant/:slug/md", (req, res) => {
  const { slug } = req.params;
  const filePath = path.join(
    process.cwd(),
    "src",
    "dataTimelineMD",
    "participants",
    `${slug}.md`
  );
  if (!fs.existsSync(filePath)) return res.status(404).send("Not found");
  const rawMd = fs.readFileSync(filePath, "utf8");
  res.type("text/markdown").send(rawMd);
});

// Lê arquivos markdown de evento
app.get("/api/events/:slug/md", (req, res) => {
  const { slug } = req.params;
  const filePath = path.join(
    process.cwd(),
    "src",
    "dataTimelineMD",
    "events",
    `${slug}.md`
  );
  if (!fs.existsSync(filePath)) return res.status(404).send("Not found");
  const rawMd = fs.readFileSync(filePath, "utf8");
  res.type("text/markdown").send(rawMd);
});

// Lê arquivos markdown de prêmio
app.get("/api/award/:slug/md", (req, res) => {
  const { slug } = req.params;
  const filePath = path.join(
    process.cwd(),
    "src",
    "dataTimelineMD",
    "awards",
    `${slug}.md`
  );
  if (!fs.existsSync(filePath)) return res.status(404).send("Not found");
  const rawMd = fs.readFileSync(filePath, "utf8");
  res.type("text/markdown").send(rawMd);
});

// Lê arquivos markdown de año
app.get("/api/year/:year/md", (req, res) => {
  const { year } = req.params;
  const filePath = path.join(
    process.cwd(),
    "src",
    "dataTimelineMD",
    "years",
    `${year}.md`
  );
  if (!fs.existsSync(filePath)) return res.status(404).send("Not found");
  const rawMd = fs.readFileSync(filePath, "utf8");
  res.type("text/markdown").send(rawMd);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
