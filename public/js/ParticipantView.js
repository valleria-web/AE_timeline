// js/ParticipantView.js
class ParticipantView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  render(data) {
    this.rootElement.innerHTML = "";

    // Recoge participantes desde distintos formatos
    let participantsArr = [];
    if (Array.isArray(data.participants)) {
      participantsArr = data.participants;
    } else if (Array.isArray(data.years)) {
      data.years.forEach(yearObj => {
        if (Array.isArray(yearObj.events)) {
          yearObj.events.forEach(event => {
            if (Array.isArray(event.participants)) {
              event.participants.forEach(p => {
                if (!participantsArr.find(x => x.slug === p.slug)) {
                  participantsArr.push(p);
                }
              });
            }
          });
        }
      });
    }

    if (!participantsArr.length) {
      this.rootElement.innerHTML = "<p style='font-size:1.6rem;margin-top:2rem;color:#4b5563;'>No se encontraron participantes.</p>";
      return;
    }

    // Contenedor principal elegante
    const container = document.createElement("div");
    container.className = "participants-list";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "2.5rem";
    container.style.marginTop = "1.5rem";

    participantsArr.forEach(p => {
      const card = document.createElement("div");
      card.className = "participant-card";
      card.style.background = "#fff";
      card.style.borderRadius = "2rem";
      card.style.boxShadow = "0 8px 32px rgba(56,56,100,0.09)";
      card.style.padding = "2.5rem 2rem";
      card.style.marginBottom = "1rem";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.alignItems = "flex-start";
      card.style.maxWidth = "680px";
      card.style.marginLeft = "auto";
      card.style.marginRight = "auto";

      // --- Header con nombre, imagen y roles
      let imgHtml = "";
      if (p.image) {
        imgHtml = `<img src="${p.image}" alt="${p.name}" style="width: 110px; height: 110px; border-radius:50%; object-fit:cover; margin-right:2rem; box-shadow:0 2px 8px #eee; border: 3px solid #f2f5fc;">`;
      }
      card.innerHTML = `
        <div style="display:flex; align-items:center; margin-bottom:1.3rem;">
          ${imgHtml}
          <div>
            <h2 style="margin:0;font-size:2.4rem;color:#4f6cff;font-weight:800;letter-spacing:1px;">
              ${p.name || "Participante sin nombre"}
            </h2>
            ${p.slug ? `<div style="color:#b7b9ce;font-size:1.08rem; margin-bottom:.1rem;">(${p.slug})</div>` : ""}
            ${Array.isArray(p.roles) && p.roles.length ? `<div style="color:#6366f1;font-weight:600; margin-bottom:.2rem;">${p.roles.join(", ")}</div>` : ""}
            ${p.draft ? `<span style="color:#c00; font-size:.95rem;"><em>Borrador</em></span>` : ""}
          </div>
        </div>
      `;

      // --- Bloque de bio, ponencia y premios destacados
      let infoHTML = "";
      if (p.bioSummary) infoHTML += `<p style="margin:.3rem 0;"><b>Bio:</b> ${p.bioSummary}</p>`;
      if (p.presentationTitle) infoHTML += `<p style="margin:.3rem 0;"><b>Ponencia:</b> <span style="color:#2c364c;">${p.presentationTitle}</span></p>`;
      if (p.presentantionSummary) infoHTML += `<p style="margin:.3rem 0 0 0;"><em>${p.presentantionSummary}</em></p>`;
      if (p.awardTitle) infoHTML += `<p style="margin:.3rem 0;"><b>Premio principal:</b> <span style="color:#9333ea">${p.awardTitle}</span></p>`;
      if (p.awardSummary) infoHTML += `<p style="margin:.3rem 0; color:#444;">${p.awardSummary}</p>`;

      if (infoHTML) {
        const infoDiv = document.createElement("div");
        infoDiv.className = "participant-info";
        infoDiv.innerHTML = infoHTML;
        card.appendChild(infoDiv);
      }

      // --- Premios recibidos (array awards)
      if (Array.isArray(p.awards) && p.awards.length > 0) {
        const awardsDiv = document.createElement("div");
        awardsDiv.className = "participant-awards";
        awardsDiv.style.marginTop = "1.4rem";
        awardsDiv.innerHTML = `<b style="color:#2563eb;font-size:1.3rem">Premios recibidos:</b>`;
        const ul = document.createElement("ul");
        ul.style.margin = "0.4rem 0 0 1rem";
        p.awards.forEach((awd) => {
          const li = document.createElement("li");
          li.innerHTML = `<span style="color:#9333ea;font-weight:600;">🏅 ${awd.name || "Premio sin nombre"}</span> ${awd.description ? `<span style="color:#4b5563;">- ${awd.description}</span>` : ""}`;
          ul.appendChild(li);
        });
        awardsDiv.appendChild(ul);
        card.appendChild(awardsDiv);
      }

      // --- Eventos en los que participó
      if (Array.isArray(p.events) && p.events.length > 0) {
        const eventsDiv = document.createElement("div");
        eventsDiv.className = "participant-events";
        eventsDiv.style.marginTop = "1.1rem";
        eventsDiv.innerHTML = `<b style="color:#2563eb;font-size:1.2rem;">Eventos:</b>`;
        const ul = document.createElement("ul");
        ul.style.margin = "0.3rem 0 0 1rem";
        p.events.forEach(evt => {
          if (!evt.title && !evt.year && !evt.city) return;
          ul.innerHTML += `
            <li>
              <span style="color:#2563eb;"><b>${evt.title || "Sin título"}</b></span>
              ${evt.year ? `<span style="color:#b7b9ce">(${evt.year})</span>` : ""}
              ${evt.city ? ` <span style="color:#64748b">- ${evt.city}</span>` : ""}
            </li>`;
        });
        eventsDiv.appendChild(ul);
        card.appendChild(eventsDiv);
      }

      container.appendChild(card);
    });

    this.rootElement.appendChild(container);
  }
}

export default ParticipantView;