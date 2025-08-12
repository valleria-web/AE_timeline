export const AWARD_TYPE_LABELS = {
  sapientiae: "Premio Sapientiae",
  embajador: "Embajador de la Paz",
  dhc: "Doctor Honoris Causa",
  maestro: "Maestro Ad Vitam",
  pax: "Pax Magister",
};

class Award {
  constructor(slug, name, year, date, city, country, description, type) {
    if (!Object.keys(AWARD_TYPE_LABELS).includes(type)) {
      throw new Error("Tipo de prêmio inválido!");
    }

    this.slug = slug;
    this.name = name;
    this.year = year;
    this.date = date;
    this.city = city;
    this.country = country;
    this.description = description;
    this.type = type;
    this.winners = [];
  }

  addWinner(winner) {
    if (!winner || !winner.slug || !winner.name) return;
    if (!this.winners.some((w) => w.slug === winner.slug)) {
      this.winners.push({ slug: winner.slug, name: winner.name });
    }
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
      type: this.type,
      winners: this.winners.map((w) => ({ slug: w.slug, name: w.name })),
    };
  }
}

export default Award;
