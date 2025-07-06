class Event {
  constructor(slug, title, date, city, country) {
    this.slug = slug;
    this.title = title;
    this.date = date;
    this.city = city;
    this.country = country;
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
      date: this.date,
      city: this.city,
      country: this.country,
      participants: this.participants.map((participant) =>
        typeof participant.getData === "function"
          ? participant.getData()
          : participant
      ),
    };
  }
}

export default Event;
