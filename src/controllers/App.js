import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

import Timeline from "../models/Timeline.js";
import YearParser from "../dataParser/YearParser.js";
import EventParser from "../dataParser/EventParser.js";
import ParticipantParser from "../dataParser/ParticipantParser.js";
import AwardParser from "../dataParser/AwardParser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class App {
  constructor() {
    this.timeline = new Timeline();
  }

  init() {
    console.log("🚀 Iniciando App.init()");

    // ── 1) Cargar Años ─────────────────────────────────────────
    const yearsDir = path.join(__dirname, "../dataTimelineMD/years");
    const yearEntries = fs.existsSync(yearsDir) ? fs.readdirSync(yearsDir) : [];
    console.log("🔍 yearsDir:", yearsDir);
    console.log("   Contenido:", yearEntries);
    const yearFiles = yearEntries.filter((f) =>
      f.toLowerCase().endsWith(".md")
    );
    console.log("   .md detectados:", yearFiles);
    yearFiles.forEach((file) => {
      const fullPath = path.join(yearsDir, file);
      console.log("   ↳ Parseando Year:", fullPath);
      const year = YearParser.parseFromMd(fullPath);
      if (year) {
        console.log("     ✅ Año:", year.slug, year.year);
        this.timeline.addYear(year);
      } else {
        console.warn("     ⚠️ Falló Year:", file);
      }
    });

    // ── 2) Cargar Eventos ───────────────────────────────────────
    const eventsDir = path.join(__dirname, "../dataTimelineMD/events");
    const eventEntries = fs.existsSync(eventsDir)
      ? fs.readdirSync(eventsDir)
      : [];
    console.log("🔍 eventsDir:", eventsDir);
    console.log("   Contenido:", eventEntries);
    const eventFiles = eventEntries.filter((f) =>
      f.toLowerCase().endsWith(".md")
    );
    console.log("   .md detectados:", eventFiles);
    eventFiles.forEach((file) => {
      const fullPath = path.join(eventsDir, file);
      console.log("   ↳ Parseando Event:", fullPath);
      const evt = EventParser.parseFromMD(fullPath);
      if (!evt) {
        console.warn("     ⚠️ Falló Event:", file);
        return;
      }
      console.log("     ✅ Evento:", evt.slug, "→ año:", evt.year);
      const yearObj = this.timeline
        .getYears()
        .find((y) => Number(evt.year) === y.year);
      if (yearObj) {
        yearObj.addEvent(evt);
        console.log(`       ↳ Agregado a Year ${yearObj.year}`);
      } else {
        console.warn(`       ⚠️ Sin Year para ${evt.year}, evento ${evt.slug}`);
      }
    });

    // ── 3) Aplanar Eventos ──────────────────────────────────────
    const allEvents = this.timeline.getYears().flatMap((y) => y.events);
    console.log("🗂️ Total eventos:", allEvents.length);

    // ── 4) Cargar Participantes ─────────────────────────────────
    const partsDir = path.join(__dirname, "../dataTimelineMD/participants");
    console.log("🔍 partsDir:", partsDir);
    console.log("   Existe?", fs.existsSync(partsDir));
    const partEntries = fs.existsSync(partsDir) ? fs.readdirSync(partsDir) : [];
    console.log("   Contenido:", partEntries);
    const partFiles = partEntries.filter((f) =>
      f.toLowerCase().endsWith(".md")
    );
    console.log("   .md detectados:", partFiles);

    const allParticipants = [];
    partFiles.forEach((file) => {
      const fullPath = path.join(partsDir, file);
      console.log("   ↳ Parseando Participant:", fullPath);
      const p = ParticipantParser.parseFromMD(fullPath);
      if (!p) {
        console.warn("     ⚠️ Falló Participant:", file);
        return;
      }
      console.log("     ✅ Participant:", p.slug);
      console.log("       • frontmatter.events:", p.events);

      // Relacionar con eventos
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(raw);
      const slugs = Array.isArray(data.events) ? data.events : [];
      slugs.forEach((slug) => {
        const evt = allEvents.find((e) => e.slug === slug);
        if (evt) {
          p.addEvent(evt);
          evt.addParticipant(p);
          console.log(`       ↳ ${p.slug} ↔ evento ${evt.slug}`);
        } else {
          console.warn(
            `       ⚠️ ${p.slug} refirió evento "${slug}" no existente`
          );
        }
      });

      allParticipants.push(p);
    });

    // ── 5) Cargar Premios (Awards) ───────────────────────────────
    const awardsDir = path.join(__dirname, "../dataTimelineMD/awards");
    console.log("🔍 awardsDir:", awardsDir);
    console.log("   Existe?", fs.existsSync(awardsDir));
    const awardEntries = fs.existsSync(awardsDir)
      ? fs.readdirSync(awardsDir)
      : [];
    console.log("   Contenido:", awardEntries);
    const awardFiles = awardEntries.filter((f) =>
      f.toLowerCase().endsWith(".md")
    );
    console.log("   .md detectados:", awardFiles);

    awardFiles.forEach((file) => {
      const fullPath = path.join(awardsDir, file);
      console.log("   ↳ Parseando Award:", fullPath);
      const award = AwardParser.parseFromMD(fullPath);
      if (!award) {
        console.warn("     ⚠️ Falló Award:", file);
        return;
      }
      console.log("     ✅ Award:", award.slug);

      const raw = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(raw);
      const winnerSlugs = Array.isArray(data.winners) ? data.winners : [];
      console.log("       • frontmatter.winners:", winnerSlugs);

      winnerSlugs.forEach((slug) => {
        const participant = allParticipants.find((p) => p.slug === slug);
        if (participant) {
          participant.addAward(award);
          if (Array.isArray(award.winners)) {
            award.winners.push(participant);
          } else {
            award.winners = [participant];
          }
          console.log(`       ↳ ${participant.slug} ganó premio ${award.slug}`);
        } else {
          console.warn(
            `       ⚠️ Ganador "${slug}" no encontrado como participante`
          );
        }
      });
    });
    

    console.log("✅ App.init() completado");



    return this.timeline;
  }
}

export default App;

const timeline = new App().init();
console.log(
  "🌐 Salida timeline.getData():\n",
  JSON.stringify(timeline.getData(), null, 2)
);
