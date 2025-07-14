// js/TimelineView.js
class TimelineView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  render(timelineData) {
    this.rootElement.innerHTML = "";

    if (!timelineData || !Array.isArray(timelineData.years) || timelineData.years.length === 0) {
      this.rootElement.textContent = "No hay datos para mostrar.";
      return;
    }

    timelineData.years.forEach((yearObj) => {
      const yearSection = document.createElement("section");
      yearSection.className = "year-card";
      yearSection.innerHTML = `<h2>${yearObj.year}</h2>${yearObj.description ? `<p>${yearObj.description}</p>` : ""}`;

      // --- Busqueda de premios: sólo lista premios por año
      if (Array.isArray(yearObj.awards) && yearObj.awards.length > 0) {
        const awardsBlock = document.createElement("div");
        awardsBlock.className = "awards-container";
        awardsBlock.innerHTML = `<h3>Premios:</h3>`;
        const ul = document.createElement("ul");
        yearObj.awards.forEach((award) => {
          const li = document.createElement("li");
          li.innerHTML = `<b>${award.name}</b>${award.winners && award.winners.length > 0 ? ` <em>(${award.winners.map(w => w.name).join(", ")})</em>` : ""}`;
          ul.appendChild(li);
        });
        awardsBlock.appendChild(ul);
        yearSection.appendChild(awardsBlock);
        this.rootElement.appendChild(yearSection);
        return;
      }

      // --- Busqueda de participantes: sólo lista participantes por año
      if (Array.isArray(yearObj.participants) && yearObj.participants.length > 0) {
        const partBlock = document.createElement("div");
        partBlock.className = "participants-container";
        partBlock.innerHTML = `<h3>Participantes:</h3>`;
        const ul = document.createElement("ul");
        yearObj.participants.forEach((p) => {
          const li = document.createElement("li");
          li.innerHTML = `<b>${p.name}</b>${Array.isArray(p.awards) && p.awards.length > 0 ? ` — Premios: ${p.awards.map(a => a.name).join(", ")}` : ""}`;
          ul.appendChild(li);
        });
        partBlock.appendChild(ul);
        yearSection.appendChild(partBlock);
        this.rootElement.appendChild(yearSection);
        return;
      }

      // --- Vista tradicional jerárquica ---
      if (Array.isArray(yearObj.events) && yearObj.events.length > 0) {
        const eventsList = document.createElement("ul");
        eventsList.className = "events-list";
        yearObj.events.forEach(evt => {
          const evtLi = document.createElement("li");
          evtLi.innerHTML = `<strong>${evt.title}</strong>`;
          // Participantes
          if (Array.isArray(evt.participants) && evt.participants.length > 0) {
            const partUl = document.createElement("ul");
            evt.participants.forEach(p => {
              const pLi = document.createElement("li");
              pLi.innerHTML = `${p.name}`;
              // Premios del participante
              if (Array.isArray(p.awards) && p.awards.length > 0) {
                const awUl = document.createElement("ul");
                p.awards.forEach(a => {
                  const awLi = document.createElement("li");
                  awLi.innerHTML = `<span style="color:#9333ea;">🏅 ${a.name}</span>`;
                  awUl.appendChild(awLi);
                });
                pLi.appendChild(awUl);
              }
              partUl.appendChild(pLi);
            });
            evtLi.appendChild(partUl);
          }
          eventsList.appendChild(evtLi);
        });
        yearSection.appendChild(eventsList);
      }

      this.rootElement.appendChild(yearSection);
    });
  }
}

export default TimelineView;