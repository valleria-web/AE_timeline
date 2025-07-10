import express from "express";
import path from "path";
import App from "./src/controllers/App.js";

const app = express();
const PORT = process.env.PORT || 3000;

const timeline = new App().init();

app.use(express.static(path.join(process.cwd(), "public")));

app.get("/api/timeline", (req, res) => {
  res.json(timeline.getData());
});

app.get('/search', (req, res) => {
  const q = req.query.q || '';
  const results = searchService.searchAll(q);
  res.json(results);
});

app.listen(PORT, () =>
  console.log(`🚀 Servidor arrancado en http://localhost:${PORT}`)
);