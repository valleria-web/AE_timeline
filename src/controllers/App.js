import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

import Timeline from "../models/Timeline.js";
import YearParser from "../dataParser/YearParser.js";
import EventParser from "../dataParser/EventParser.js";
import ParticipantParser from "../dataParser/ParticipantParser.js";
import AwardParser from "../dataParser/AwardParser.js";
import SearchService from "../searchService/SearchService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class App {
  constructor() {
    this.timeline = new Timeline();
  }

  init() {
    // 1. Cargar años
    const yearsDir = path.join(__dirname, "../dataTimelineMD/years");
    const years = fs.existsSync(yearsDir)
      ? fs.readdirSync(yearsDir).filter((f) => f.endsWith(".md"))
      : [];
    years.forEach((file) => {
      const y = YearParser.parseFromMd(path.join(yearsDir, file));
      if (y) this.timeline.addYear(y);
      else console.warn("⚠️ Falló Year:", file);
    });

    // 2. Cargar eventos
    const eventsDir = path.join(__dirname, "../dataTimelineMD/events");
    const events = fs.existsSync(eventsDir)
      ? fs.readdirSync(eventsDir).filter((f) => f.endsWith(".md"))
      : [];
    events.forEach((file) => {
      const evt = EventParser.parseFromMD(path.join(eventsDir, file));
      if (!evt) return console.warn("⚠️ Falló Event:", file);
      const yearObj = this.timeline
        .getYears()
        .find((y) => Number(evt.year) === y.year);
      if (yearObj) yearObj.addEvent(evt);
      else console.warn(`⚠️ Sin Year para ${evt.year}, evento ${evt.slug}`);
    });

    // 3. Flatten eventos
    const allEvents = this.timeline.getYears().flatMap((y) => y.events);

    // 4. Cargar participantes
    const partsDir = path.join(__dirname, "../dataTimelineMD/participants");
    const participants = fs.existsSync(partsDir)
      ? fs.readdirSync(partsDir).filter((f) => f.endsWith(".md"))
      : [];
    const allParticipants = [];
    participants.forEach((file) => {
      const fullPath = path.join(partsDir, file);
      const p = ParticipantParser.parseFromMD(fullPath);
      if (!p) return console.warn("⚠️ Falló Participant:", file);

      // Relacionar eventos ↔ participantes
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(raw);
      const eventSlugs = Array.isArray(data.events) ? data.events : [];
      eventSlugs.forEach((slug) => {
        const evt = allEvents.find((e) => e.slug === slug);
        if (evt) {
          p.addEvent(evt);
          evt.addParticipant(p);
        } else {
          console.warn(`⚠️ ${p.slug} refirió evento "${slug}" no existente`);
        }
      });

      if (!allParticipants.some((par) => par.slug === p.slug)) {
        allParticipants.push(p);
      }
    });

    // 5. Cargar premios (awards)
    const awardsDir = path.join(__dirname, "../dataTimelineMD/awards");
    const awards = fs.existsSync(awardsDir)
      ? fs.readdirSync(awardsDir).filter((f) => f.endsWith(".md"))
      : [];
    const allAwards = [];
    awards.forEach((file) => {
      const fullPath = path.join(awardsDir, file);
      const award = AwardParser.parseFromMD(fullPath);
      if (!award) return console.warn("⚠️ Falló Award:", file);

      // Relacionar ganadores ↔ premios (bidireccional)
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(raw);
      const winnerObjs = Array.isArray(data.winners) ? data.winners : [];
      award.winners = [];
      winnerObjs.forEach((win) => {
        // win puede ser string (slug) o objeto { slug, name }
        const slug = typeof win === "object" && win.slug ? win.slug : win;
        const name = typeof win === "object" && win.name ? win.name : slug;
        const participant = allParticipants.find((p) => p.slug === slug);
        if (participant) {
          // Bidireccional: Participante recebe prêmio
          participant.addAward(award);
          // Prêmio recebe referência ao participante (name sempre presente)
          if (!award.winners.find((p) => p.slug === participant.slug)) {
            award.winners.push({ slug: participant.slug, name: participant.name });
          }
        } else {
          console.warn(`Ganador "${name}" no encontrado como participante`);
        }
      });

      if (!allAwards.some((a) => a.slug === award.slug)) {
        allAwards.push(award);
      }
    });

    // 6. Resolver awards en participantes (slug → objeto)
    const awardMap = new Map();
    allAwards.forEach((award) => awardMap.set(award.slug, award));
    allParticipants.forEach((participant) => {
      if (Array.isArray(participant.awards)) {
        participant.awards = participant.awards.map((slugOrAward) => {
          if (typeof slugOrAward === "string" && awardMap.has(slugOrAward)) {
            return awardMap.get(slugOrAward);
          } else if (typeof slugOrAward === "string") {
            console.warn(
              `[App] Participante "${participant.slug}" tiene premio desconocido: "${slugOrAward}"`
            );
            return { name: slugOrAward + " (Premio no encontrado)", description: "" };
          } else if (typeof slugOrAward === "object" && slugOrAward.name) {
            return slugOrAward;
          } else {
            return { name: "Premio desconocido", description: "" };
          }
        });
      }
    });

    // --- Devuelve timeline, awards y participants
    return {
      timeline: this.timeline,
      awards: allAwards,
      participants: allParticipants,
    };
  }
}

export default App;


/*
const { timeline, participants, awards } = new App().init();

const yearArr = timeline.getYears();

const eventsArr = yearArr.flatMap(y => y.events);

const participantsArr = participants;

const awardsArr = awards;

const searchService = new SearchService({
  years: yearArr,
  events: eventsArr,
  participants: participantsArr,
  awards: awardsArr,
});
*/

// 7. Realizar una búsqueda global
/*
const results = searchService.searchAll("educadora");
console.log(results.events);        // Eventos que coinciden
console.log(results.participants);  // Participantes que coinciden
console.log(results.years);         // Años que coinciden
console.log(results.awards);        // Premios que coinciden
*/

/*
const awardArr = awards.map(a => a.getData());
const awardSearcher = new AwardSearcher(awardArr);
const resultado = awardSearcher.search("premio")
console.log(resultado)
*/

/*
const participantArr = participants.map(p => p.getData());
console.log(participantArr);
const participantSearcher = new ParticipantSearcher(participantArr);
const resultado = participantSearcher.search("camila")
console.log(resultado)
*/

/*
const years = timeline.getYears();
const events = years.flatMap(y => y.getEvents());
//console.log(events);
const eventsSearcher = new EventSearcher(events);
const resultado = eventsSearcher.search("seminario");
console.log(resultado)
*/

/*
const years = timeline.getYears();
const yearSearcher = new YearSearcher(years);
const resultado = yearSearcher.search(2010)
console.log(resultado)
*/

// 2) Preparar arrays para SearchService

const { timeline, participants, awards } = new App().init();

const yearArr = timeline.getYears();

const eventsArr = yearArr.flatMap((y) => y.events);

const participantsArr = participants;

const awardsArr = awards;

// 3) Crear el servicio de búsqueda con los datos preparados
const searchService = new SearchService({
  years: yearArr,
  events: eventsArr,
  participants: participantsArr,
  awards: awards,
});

//4) Realizar búsquedas
/*
console.log("--- Búsqueda por Year ---");
console.table(searchService.searchAll(2010).years);
*/

/*
console.log("--- Búsqueda por Event  ---");
console.table(searchService.searchAll("premio").events);


console.log("--- Búsqueda por Participant  ---");
console.table(searchService.searchAll("camila").participants);
*/

/*
console.log("--- Búsqueda por Award  ---");
console.table(searchService.searchAll("trofeo").awards.map(a => a.getData()));
*/
