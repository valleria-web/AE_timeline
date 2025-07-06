import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Year from "../models/Year.js";
import EventParser from "./EventParser.js";

class YearParser {
  static loadFromMd(yearMdPath) {
    const raw = fs.readFileSync(yearMdPath, "utf8");
    console.log("Contenido RAW del archivo:", raw);
    const { data, content } = matter(raw);

    const year = new Year(data.slug, data.year, data.description || content);

    (data.eventos || []).forEach((evSlug) => {
      const event = EventParser.loadBySlug(evSlug);
      if (event) year.addEvent(event);
    });

    return year;
  }
}

export default YearParser;
