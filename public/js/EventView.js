class EventView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  render(data) {
    this.rootElement.innerHTML = "";

    // Flexible: acepta { events: [...] } o { years: [...] }
    let eventsArr = [];
    if (Array.isArray(data.events)) {
      eventsArr = data.events;
    } else if (Array.isArray(data.years)) {
      data.years.forEach(yearObj => {
        if (Array.isArray(yearObj.events)) {
          yearObj.events.forEach(evt => eventsArr.push(evt));
        }
      });
    }

    if (!eventsArr.length) {
      this.rootElement.innerHTML = "<p>No se encontraron eventos.</p>";
      return;
    }

    // Listado elegante con cards y jerarquía simple
    const eventsList = document.createElement("div");
    eventsList.className = "events-list";
    eventsList.style.display = "flex";
    eventsList.style.flexDirection = "column";
    eventsList.style.gap = "2.5rem";

    eventsArr.forEach(evt => {
      const card = document.createElement("div");
      card.className = "event-card";
      card.style.background = "#fff";
      card.style.border = "1px solid #e5e7eb";
      card.style.borderRadius = "18px";
      card.style.boxShadow = "0 4px 18px rgba(0,0,0,0.06)";
      card.style.padding = "2rem";
      card.style.marginBottom = "1rem";

      card.innerHTML = `
        <h2 style="color:#4753f5;margin:0 0 1rem 0;">${evt.title || "Evento sin título"}</h2>
        <div style="font-size:1.05rem;color:#222;">
          <span><b>Año:</b> ${evt.year || "-"}</span> ·
          <span><b>Fecha:</b> ${evt.date || "-"}</span> ·
          <span><b>Ciudad:</b> ${evt.city || "-"}</span> ·
          <span><b>País:</b> ${evt.country || "-"}</span>
        </div>
      `;

      // Participantes (en jerarquía elegante)
      if (Array.isArray(evt.participants) && evt.participants.length > 0) {
        const ul = document.createElement("ul");
        ul.className = "event-participants-list";
        ul.style.margin = "1.2rem 0 0 1rem";
        evt.participants.forEach(p => {
          const li = document.createElement("li");
          li.style.marginBottom = ".3rem";
          li.innerHTML = `<b>${p.name}</b>`;
          // Premios del participante (solo nombre)
          if (Array.isArray(p.awards) && p.awards.length > 0) {
            const awUl = document.createElement("ul");
            awUl.className = "participant-awards";
            awUl.style.margin = "0.25rem 0 0 1.5rem";
            p.awards.forEach(a => {
              const awLi = document.createElement("li");
              awLi.innerHTML = `<span style="color:#9333ea;">🏅 ${a.name}</span>`;
              awUl.appendChild(awLi);
            });
            li.appendChild(awUl);
          }
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }

      eventsList.appendChild(card);
    });

    this.rootElement.appendChild(eventsList);
  }
}

export default EventView;