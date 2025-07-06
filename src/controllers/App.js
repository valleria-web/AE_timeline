import Timeline from "../models/Timeline.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import YearParser from "../dataParser/YearParser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class App {
  constructor() {
    this.timeline = new Timeline();
  }

  init() {
    const yearsDir = path.join(__dirname, "../data/timeline/years");

    const yearFiles = fs
      .readdirSync(yearsDir)
      .filter((file) => file.endsWith(".md"));

    yearFiles.forEach((yearFile) => {
      const filePath = path.join(yearsDir, yearFile);
      const year = YearParser.loadFromMd(filePath);
      if (year) this.timeline.addYear(year);
    });

    return this.timeline;
  }
}

export default App;

const app = new App();
const timeline = app.init();
console.log(timeline.getYears());
