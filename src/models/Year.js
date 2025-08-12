class Year {
  constructor(slug, year, description = "", president) {
    this.slug = slug;
    this.year = year;
    this.description = description || "";
    this.events = [];
    this.president = president;
  }

  addEvent(event) {
    this.events.push(event);
  }

  getEvents() {
    return this.events;
  }

  getData() {
    return {
      slug: this.slug,
      year: this.year,
      description: this.description,
      events: this.events.map((event) =>
        typeof event.getData === "function" ? event.getData() : event
      ),
      president: this.president,
    };
  }
}

export default Year;
