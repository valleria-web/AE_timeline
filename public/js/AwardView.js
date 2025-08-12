// js/AwardView.js

class AwardView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  async render(data, awardTypeFilter = null) {
    this.rootElement.innerHTML = "";

    // 1. Normaliza la lista de premios
    let awardsArr = [];
    if (Array.isArray(data.awards)) {
      awardsArr = data.awards;
    } else if (Array.isArray(data.years)) {
      data.years.forEach((yearObj) => {
        if (Array.isArray(yearObj.awards)) {
          yearObj.awards.forEach((awd) => awardsArr.push(awd));
        }
      });
    } else if (data.slug && data.name) {
      awardsArr = [data];
    }

    if (awardTypeFilter) {
      awardsArr = awardsArr.filter(
        (a) => (a.type || a.category) === awardTypeFilter
      );
    }

    // Sin premios
    if (!awardsArr.length) {
      this.rootElement.innerHTML = "<p>No se encontraron premios.</p>";
      return;
    }

    // Más de un premio: lista clickeable, mostrando ganadores de cada premio
    if (awardsArr.length > 1) {
      const ul = document.createElement("ul");
      ul.className = "awards-list-simple";
      ul.style.fontSize = "1.15rem";
      ul.style.lineHeight = "1.7";
      ul.style.margin = "2.5rem auto";
      ul.style.maxWidth = "540px";
      ul.style.padding = "0 0 2.5rem 0";
      awardsArr.forEach((awd) => {
        const li = document.createElement("li");
        // Lista los ganadores de ese premio
        let winnersHTML = "";
        if (awd.winners && awd.winners.length > 0) {
          winnersHTML = `<ul style="margin:.5em 0 0 1.2em; font-size:.97em;">
            ${awd.winners
              .map(
                (w) =>
                  `<li>
                    <a href="#" data-participant="${w.slug}" style="color:#1565c0;">${w.name}</a>
                  </li>`
              )
              .join("")}
          </ul>`;
        } else {
          winnersHTML = `<em style="color:#888; font-size:.93em;">Ningún ganador registrado</em>`;
        }
        li.innerHTML = `<a href="#" data-slug="${awd.slug}"><b>${
          awd.name || awd.slug
        }</b></a>
          <div>${winnersHTML}</div>`;
        ul.appendChild(li);
      });
      this.rootElement.appendChild(ul);

      // Listener para mostrar detalles de premio al hacer click en nombre del premio
      ul.addEventListener("click", async (e) => {
        const link = e.target.closest("a[data-slug]");
        if (link) {
          e.preventDefault();
          const slug = link.getAttribute("data-slug");
          const premioDetalhado = awardsArr.find((a) => a.slug === slug) || {
            slug,
          };
          await this.render({ awards: [premioDetalhado] });
        }
      });

      // Listener para mostrar participante al hacer click en nombre del ganador
      ul.querySelectorAll('a[data-participant]').forEach(link => {
        link.addEventListener('click', async (e) => {
          e.preventDefault();
          const slug = link.getAttribute('data-participant');
          await this.showParticipantProfile(slug);
        });
      });

      return;
    }

    // Solo 1 premio: muestra .md + ganadores
    const award = awardsArr[0];
    if (!award || !award.slug) {
      this.rootElement.innerHTML =
        "<p>No se pudo encontrar el archivo del premio.</p>";
      return;
    }

    // Renderiza lista de ganadores arriba del markdown
    let winnersHTML = "";
    if (award.winners && award.winners.length > 0) {
      winnersHTML = `<div style="margin-bottom:1.4em; padding:.7em 1.1em; background:#f7faff; border-radius:9px;">
        <b>Ganadores:</b>
        <ul style="margin:.45em 0 0 1.2em;">
          ${award.winners
            .map(
              (w) =>
                `<li>
                  <a href="#" data-participant="${w.slug}" style="color:#1976d2;">${w.name}</a>
                </li>`
            )
            .join("")}
        </ul>
      </div>`;
    } else {
      winnersHTML = `<div style="margin-bottom:1.3em;"><em style="color:#888;">Ningún ganador registrado para este premio.</em></div>`;
    }

    try {
      const res = await fetch(`/api/award/${award.slug}/md`);
      if (!res.ok) throw new Error("No se pudo cargar el archivo md.");
      const md = await res.text();
      // Limpiar frontmatter
      const cleanMd = md.replace(/^\s*---[\s\S]*?---\s*/m, "");
      const html = window.marked
        ? marked.parse(cleanMd)
        : `<pre>${cleanMd}</pre>`;
      const div = document.createElement("div");
      div.className = "award-md-full";
      div.style.maxWidth = "800px";
      div.style.margin = "2rem auto";
      div.innerHTML = winnersHTML + html;

      this.rootElement.appendChild(div);

      // Listener para mostrar participante al hacer click en nombre del ganador
      div.querySelectorAll('a[data-participant]').forEach(link => {
        link.addEventListener('click', async (e) => {
          e.preventDefault();
          const slug = link.getAttribute('data-participant');
          await this.showParticipantProfile(slug);
        });
      });

    } catch (err) {
      this.rootElement.innerHTML =
        "<p>No se pudo cargar el perfil del premio.</p>";
    }
  }

  // Método auxiliar para mostrar perfil del participante usando el mismo div root
  async showParticipantProfile(slug) {
    try {
      const res = await fetch(`/api/participant/${slug}/md`);
      if (!res.ok) {
        this.rootElement.innerHTML = "<p>No se pudo cargar el participante.</p>";
        return;
      }
      const md = await res.text();
      const cleanMd = md.replace(/^\s*---[\s\S]*?---\s*/m, "");
      const html = window.marked ? marked.parse(cleanMd) : `<pre>${cleanMd}</pre>`;
      this.rootElement.innerHTML = `<div style="max-width:800px; margin:2rem auto">${html}</div>`;
    } catch (err) {
      this.rootElement.innerHTML = "<p>No se pudo cargar el participante.</p>";
    }
  }
}

export default AwardView;