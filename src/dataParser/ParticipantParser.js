import fs from "fs";
import matter from "gray-matter";
import Participant from "../models/Participant.js";

class ParticipantParser {
  static parseFromMD(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);

    return new Participant({
      slug: data.slug,
      name: data.name,
      role: data.role,
      image: data.image,
      events: Array.isArray(data.events) ? data.events : [],
      awards: Array.isArray(data.awards) ? data.awards : [],
      presentationTitle: data.presentationTitle,
      awardTitle: data.awardTitle,
      bioSummary: data.bioSummary,
      presentantionSummary: data.presentantionSummary,
      awardSummary: data.awardSummary,
      draft: data.draft ?? false
    });
  }
}

export default ParticipantParser;
