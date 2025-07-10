class TimelineView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  render(timelineData) {
    this.rootElement.innerHTML = "";

    timelineData.years.forEach((yearObj) => {
      const yearDiv = document.createElement("section");
      yearDiv.className = "year-card";
      yearDiv.innerHTML = `<h2>${yearObj.year}</h2>
        <p>${yearObj.description}</p>
      `;

      yearObj.events.forEach((evt) => {
        const eDiv = document.createElement("article");
        eDiv.className = "event-card";
        eDiv.innerHTML = `
          <h3>${evt.title}</h3>
          <p>${evt.date} — ${evt.city}, ${evt.country}</p>
        `;

        evt.participants.forEach((p) => {
          const pDiv = document.createElement("div");
          pDiv.className = "participant-card";
          pDiv.innerHTML = `<strong>${p.name}</strong>`;
          eDiv.appendChild(pDiv);
        });

        yearDiv.appendChild(eDiv);
      });

      this.rootElement.appendChild(yearDiv);
    });
  }
}

export default TimelineView;


  /**
   * timelineData tiene la forma:
   * {
   *   years: [
   *     {
   *       year: number,
   *       description: string,
   *       events: [
   *         {
   *           title: string,
   *           date: string,
   *           city: string,
   *           country: string,
   *           participants: [
   *             {
   *               slug: string,
   *               name: string,
   *               awards: [ { slug, name, description } ]
   *             }
   *           ]
   *         }
   *       ]
   *     }
   *   ]
   * }
   */