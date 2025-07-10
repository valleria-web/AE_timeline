class TimelineView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }
  render(timelineData) {
    this.rootElement.innerHTML = "";

    if (!timelineData || !Array.isArray(timelineData.years)) {
      this.rootElement.textContent = "No hay datos para mostrar.";
      return;
    }

    timelineData.years.forEach((yearObj) => {
      const yearSection = document.createElement("section");
      yearSection.className = "year-card";
      yearSection.innerHTML = `
        <h2>${yearObj.year}</h2>
        <p>${yearObj.description}</p>
      `;

      const eventsContainer = document.createElement("div");
      eventsContainer.className = "events-container";

      yearObj.events.forEach((evt) => {
        const eventArticle = document.createElement("article");
        eventArticle.className = "event-card";
        eventArticle.innerHTML = `
          <h3>${evt.title}</h3>
          <p>${evt.date} — ${evt.city}, ${evt.country}</p>
        `;

        const participantsContainer = document.createElement("div");
        participantsContainer.className = "participants-container";

        if (Array.isArray(evt.participants) && evt.participants.length) {
          evt.participants.forEach((p) => {
            const pDiv = document.createElement("div");
            pDiv.className = "participant-card";
            pDiv.innerHTML = `
              <strong>${p.name}</strong>
              <span class="participant-slug">(${p.slug})</span>
            `;

            const awards = Array.isArray(p.awards) ? p.awards : [];
            const uniqueAwards = [
              ...new Map(
                awards.filter((a) => a && a.name).map((a) => [a.slug, a])
              ).values(),
            ];

            if (uniqueAwards.length) {
              const awardList = document.createElement("ul");
              awardList.className = "awards-list";
              uniqueAwards.forEach((awd) => {
                const li = document.createElement("li");
                li.textContent = `${awd.name}: ${awd.description}`;
                awardList.appendChild(li);
              });
              pDiv.appendChild(awardList);
            } else {
              const noAwards = document.createElement("p");
              noAwards.className = "no-awards";
              noAwards.textContent = "Sin premios";
              pDiv.appendChild(noAwards);
            }

            participantsContainer.appendChild(pDiv);
          });
        } else {
          const none = document.createElement("p");
          none.textContent = "Sin participantes";
          participantsContainer.appendChild(none);
        }

        eventArticle.appendChild(participantsContainer);
        eventsContainer.appendChild(eventArticle);
      });

      yearSection.appendChild(eventsContainer);
      this.rootElement.appendChild(yearSection);
    });
  }
}

export default TimelineView;
