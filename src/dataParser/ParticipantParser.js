import fs from "fs";
import matter from "gray-matter";
import Participant from "../models/Participant.js";

class ParticipantParser {
  static parseFromMD(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    // Normaliza roles (acepta array o string)
    let roles = [];
    if (Array.isArray(data.role)) roles = data.role;
    else if (typeof data.role === "string") roles = [data.role];

    // Asegura que todo lo importante esté bien mapeado
    const participantProps = {
      slug: data.slug || "",
      name: data.name || "",
      roles: roles,
      image: data.image || "",
      events: Array.isArray(data.events) ? data.events.filter(e => typeof e === "string") : [],
      awards: Array.isArray(data.awards) ? data.awards.filter(a => typeof a === "string") : [],
      presentationTitle: data.presentationTitle || data.presentationtitle || "",
      awardTitle: data.awardTitle || data.awardtitle || "",
      bioSummary: data.bioSummary || data.biosummary || "",
      presentantionSummary: data.presentantionSummary || data.presentationSummary || data.presentationsummary || "",
      awardSummary: data.awardSummary || data.awardsummary || "",
      draft: data.draft === true || data.draft === "true",
      content
    };

    return new Participant(participantProps);
  }
}

export default ParticipantParser;