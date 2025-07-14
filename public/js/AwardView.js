class AwardView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  render(data) {
    this.rootElement.innerHTML = "";

    // Espera { awards: [...] } o { years: [...] } con awards dentro de cada year
    let awardsArr = [];

    if (Array.isArray(p.awards) && p.awards.length > 0) {
      const ul = document.createElement("ul");
      ul.className = "participant-awards";
      ul.innerHTML = "<strong>Premios:</strong>";
      p.awards.forEach((awd) => {
        const li = document.createElement("li");
        if (typeof awd === "string") {
          li.textContent = awd;
        } else if (awd && awd.name) {
          li.innerHTML = `<b>${awd.name}</b>${
            awd.description ? ": " + awd.description : ""
          }`;
        } else {
          li.textContent = "Premio desconocido";
        }
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    if (!awardsArr.length) {
      this.rootElement.innerHTML = "<p>No se encontraron premios.</p>";
      return;
    }

    // Renderiza cada premio con todos los campos
    const awardsList = document.createElement("div");
    awardsList.className = "awards-list";

    awardsArr.forEach((award) => {
      const awardDiv = document.createElement("div");
      awardDiv.className = "award-card";
      awardDiv.innerHTML = `
        <h3>${
          award.name || "Premio sin nombre"
        } <span style="font-size: 1rem; color: #888;">(${
        award.year || ""
      })</span></h3>
        ${award.date ? `<p><strong>Fecha:</strong> ${award.date}</p>` : ""}
        ${
          award.city || award.country
            ? `<p><strong>Lugar:</strong> ${award.city || ""}${
                award.city && award.country ? ", " : ""
              }${award.country || ""}</p>`
            : ""
        }
        ${award.description ? `<p>${award.description}</p>` : ""}
      `;

      // Ganadores
      if (Array.isArray(award.winners) && award.winners.length > 0) {
        const winnersList = document.createElement("ul");
        winnersList.className = "winners-list";
        award.winners.forEach((winner) => {
          const li = document.createElement("li");
          li.textContent =
            winner.name + (winner.slug ? ` (${winner.slug})` : "");
          winnersList.appendChild(li);
        });
        awardDiv.appendChild(document.createElement("strong")).textContent =
          "Ganadores:";
        awardDiv.appendChild(winnersList);
      }

      awardsList.appendChild(awardDiv);
    });

    this.rootElement.appendChild(awardsList);
  }
}

export default AwardView;
