class Timeline {
  constructor() {
    this.years = [];
  }

  addYear(year) {
    this.years.push(year);
  }

  getYears() {
    return this.years;
  }

  getData() {
    return {
      slug: this.slug,
      years: this.years.map((year) =>
        typeof year.getData === "function" ? year.getData() : year
      ),
    };
  }
}

export default Timeline;
