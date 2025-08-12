// js/TimelineView.js
class TimelineView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  render(timelineData) {
    this.rootElement.innerHTML = "";

    if (
      !timelineData ||
      !Array.isArray(timelineData.years) ||
      timelineData.years.length === 0
    ) {
      this.rootElement.textContent = "No hay datos para mostrar.";
      return;
    }

    // Ordenar los años en forma descendente (más reciente arriba)
    const sortedYears = timelineData.years
      .slice()
      .sort((a, b) => b.year - a.year);

    sortedYears.forEach((yearObj) => {
      const yearSection = document.createElement("section");
      yearSection.className = "year-card";
      yearSection.innerHTML = `
        <h2>
          <a 
            href="#/year/${yearObj.year}" 
          >
            ${yearObj.year}
          </a>
        </h2>
        ${yearObj.description ? `<p>${yearObj.description}</p>` : ""}
      `;

      // --- Busqueda de premios: sólo lista premios por año
      if (Array.isArray(yearObj.awards) && yearObj.awards.length > 0) {
        const awardsBlock = document.createElement("div");
        awardsBlock.className = "awards-container";
        awardsBlock.innerHTML = `<h3>Premios:</h3>`;
        const ul = document.createElement("ul");
        yearObj.awards.forEach((award) => {
          const li = document.createElement("li");
          li.innerHTML = `<b>
            <a 
              href="#/premio/${award.slug || award.name}" 
            >
              ${award.name}
            </a>
            </b>
            ${
              award.winners && award.winners.length > 0
                ? ` <em>(${award.winners.map((w) => w.name).join(", ")})</em>`
                : ""
            }`;
          ul.appendChild(li);
        });
        awardsBlock.appendChild(ul);
        yearSection.appendChild(awardsBlock);
        this.rootElement.appendChild(yearSection);
        return;
      }

      // --- Busqueda de participantes: sólo lista participantes por año
      if (
        Array.isArray(yearObj.participants) &&
        yearObj.participants.length > 0
      ) {
        const partBlock = document.createElement("div");
        partBlock.className = "participants-container";
        partBlock.innerHTML = `<h3>Participantes:</h3>`;
        const ul = document.createElement("ul");
        yearObj.participants.forEach((p) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <a 
              href="#/participante/${p.slug || p.name}" 
            >
              <b>${p.name}</b>
            </a>
          `;
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
        yearObj.events.forEach((evt) => {
          const evtLi = document.createElement("li");
          evtLi.innerHTML = `<strong>
            <a 
              href="#/evento/${evt.slug}" 
            >
              ${evt.title}
            </a>
          </strong>`;
          // Participantes
          if (Array.isArray(evt.participants) && evt.participants.length > 0) {
            const partUl = document.createElement("ul");
            evt.participants.forEach((p) => {
              const pLi = document.createElement("li");
              pLi.innerHTML = `
                <a 
                  href="#/participante/${p.slug}" 
                >
                  ${p.name}
                </a>
              `;
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