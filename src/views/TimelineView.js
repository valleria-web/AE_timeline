class TimelineView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  render(timeline) {
    this.rootElement.innerHTML = "";

    timeline.getYears().forEach((year) => {
      const yearDiv = document.createElement("div");
      yearDiv.className = "year-card";
      yearDiv.innerHTML = `<h2>${year.value}</h2>`;

      year.getEvents().forEach((event) => {
        const eventDiv = document.createElement("div");
        eventDiv.className = "event-card";
        eventDiv.innerHTML = `
        <h3>${event.title}</h3>
        <p>${event.date} - ${event.city}, ${event.country}</p>
      `;

        event.getParticipant().forEach((participant) => {
          const participantDiv = document.createElement("div");
          participantDiv.className = "participant-card";
          participantDiv.innerHTML = `<strong>${participant.name}</strong>`;

          eventDiv.appendChild(participantDiv);
        });

        yearDiv.appendChild(eventDiv);
      });

      this.rootElement.appendChild(yearDiv);
    });
  }
}

export default TimelineView;
