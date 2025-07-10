import App from "../controllers/App.js";
import YearSearcher from "./YearSearcher.js";

const timeline = new App().init();
const data = timeline.getData();
const events = data.events;

const yearSearcher = new YearSearcher(events);

const resultado = yearSearcher.search(2024);

console.log(`Eventos en 2024 (${resultado.length}):`);
console.table(resultado);
