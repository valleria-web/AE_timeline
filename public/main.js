import App from "../src/controllers/App.js";
import TimelineView from "../src/views/TimelineView.js";

const app = new App();
const timeline = app.init();

const rootElement = document.getElementById("timeline-root");

const view = new TimelineView(rootElement);

view.render(timeline);