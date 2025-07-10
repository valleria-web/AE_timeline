// src/models/Participant.js
class Participant {
  constructor({
    slug,
    name,
    roles,
    image,
    events = [],
    awards = [],
    presentationTitle,
    awardTitle,
    bioSummary,
    presentantionSummary,
    awardSummary,
    draft = false,
  }) {
    this.slug = slug;
    this.name = name;
    this.roles = roles;
    this.image = image;
    this.events = events;
    this.awards = awards;
    this.presentationTitle = presentationTitle;
    this.awardTitle = awardTitle;
    this.bioSummary = bioSummary;
    this.presentantionSummary = presentantionSummary;
    this.awardSummary = awardSummary;
    this.draft = draft;
  }

  addEvent(event) {
    this.events.push(event);
  }

  addAward(award) {
    this.awards.push(award);
  }

  getData() {
    return {
      slug: this.slug,
      name: this.name,
      roles: this.roles,
      image: this.image,
      presentationTitle: this.presentationTitle,
      awardTitle: this.awardTitle,
      bioSummary: this.bioSummary,
      presentantionSummary: this.presentantionSummary,
      awardSummary: this.awardSummary,
      draft: this.draft,
      events: this.events.map((evt) =>
        typeof evt.getData === "function" ? evt.getData() : evt
      ),
      awards: this.awards.map((awd) =>
        typeof awd.getData === "function" ? awd.getData() : awd
      ),
    };
  }
}

export default Participant;
