import fs from "fs";
import matter from "gray-matter";
import Event from "../models/Event.js";

class EventParser {
  static parseFromMD(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    return new Event(
      data.slug,
      data.title,
      data.year,
      data.date,
      data.city,
      data.country,
      data.description,
      content
    );
  }
}

export default EventParser;
