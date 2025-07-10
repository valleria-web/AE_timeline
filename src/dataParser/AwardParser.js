import fs from "fs";
import matter from "gray-matter";
import Award from "../models/Award.js";

class AwardParser {
  static parseFromMD(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);

    const award = new Award(
      data.slug,
      data.name,
      data.year,
      data.date,
      data.city,
      data.country,
      data.description
    );
    award.winners = [];
    return award;
  }
}

export default AwardParser;
