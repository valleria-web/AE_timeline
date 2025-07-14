class Event {
  constructor(slug, title, year, date, city, country, description) {
    this.slug = slug;
    this.title = title;
    this.year = year;
    this.date = date;
    this.city = city;
    this.country = country;
    this.description = description;
    this.participants = [];
  }

  addParticipant(participant) {
    this.participants.push(participant);
  }

  getParticipant() {
    return this.participants;
  }

  getData() {
    return {
      slug: this.slug,
      title: this.title,
      year: this.year,
      date: this.date,
      city: this.city,
      country: this.country,
      participants: this.participants.map((p) => ({
        slug: p.slug,
        name: p.name,
        awards: p.awards.map((a) => ({
          name: a.name,
        }))
      }))
    };
  }
}

export default Event;