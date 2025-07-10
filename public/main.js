import TimelineView from "./js/TimelineView.js";

async function bootstrap() {
  const res = await fetch("/api/timeline");
  const data = await res.json();
  const root = document.getElementById("timeline-root");
  const view = new TimelineView(root);
  view.render(data);
}

bootstrap();
