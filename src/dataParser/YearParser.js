import fs from "fs";
import matter from "gray-matter";
import Year from "../models/Year.js";

class YearParser {
  static parseFromMd(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);

    return new Year(
      data.slug, 
      data.year, 
      data.description);
  }
}

export default YearParser;
