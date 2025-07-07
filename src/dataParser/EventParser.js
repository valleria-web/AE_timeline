import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Event from "../models/Event.js";

class EventParser {
  static parseBySlug(slug) {
    const eventPath = path.join(
      "src",
      "data",
      "timeline",
      "events",
      `${slug}.md`
    );

    if (!fs.existsSync(eventPath)) return null;

    const raw = fs.readFileSync(eventPath, "utf8");
    const { data } = matter(raw);

    return new Event(
      data.slug,
      data.title,
      data.date,
      data.city,
      data.country
    );
  }
}

export default EventParser;
