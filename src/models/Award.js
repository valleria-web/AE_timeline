class Award {
  constructor(slug, name, year, date, city, country, description) {
    this.slug = slug;
    this.name = name;
    this.year = year;
    this.date = date;
    this.city = city;
    this.country = country;
    this.description = description;
    this.winners = []; 
  }

  getData() {
    return {
      slug: this.slug,
      name: this.name,
      year: this.year,
      date: this.date,
      city: this.city,
      country: this.country,
      description: this.description,
      winners: this.winners.map((p) => ({
        slug: p.slug,
        name: p.name
      }))
    };
  }
}

export default Award;