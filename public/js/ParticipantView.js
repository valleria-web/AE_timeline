// js/ParticipantView.js

class ParticipantView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  async render(data, searchQuery = "") {
    this.rootElement.innerHTML = "";

    // --- Normaliza la lista de participantes ---
    let participantsArr = [];
    if (Array.isArray(data.participants)) {
      participantsArr = data.participants;
    } else if (Array.isArray(data.years)) {
      data.years.forEach((yearObj) => {
        if (Array.isArray(yearObj.events)) {
          yearObj.events.forEach((event) => {
            if (Array.isArray(event.participants)) {
              event.participants.forEach((p) => {
                if (!participantsArr.find((x) => x.slug === p.slug)) {
                  participantsArr.push(p);
                }
              });
            }
          });
        }
      });
    }

    if (!participantsArr.length) {
      this.rootElement.innerHTML =
        "<p style='font-size:1.6rem;margin-top:2rem;color:#4b5563;'>No se encontraron participantes.</p>";
      return;
    }

    // --- Si hay más de un participante: muestra listado clickable ---
    if (participantsArr.length > 1) {
      const ul = document.createElement("ul");
      ul.className = "participant-list-simple";
      ul.style.fontSize = "1.2rem";
      ul.style.lineHeight = "1.8";
      ul.style.margin = "2.5rem auto";
      ul.style.maxWidth = "540px";
      ul.style.padding = "0 0 2.5rem 0";
      participantsArr.forEach((p) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <a 
            href="#" 
            data-slug="${p.slug}"
          >
            <b>${p.name || p.slug}</b>
          </a>
        `;
        ul.appendChild(li);
      });
      this.rootElement.appendChild(ul);

      // --- Interacción: al hacer click en el nombre, carga el perfil completo ---
      ul.addEventListener("click", async (e) => {
        const link = e.target.closest("a[data-slug]");
        if (link) {
          e.preventDefault();
          const slug = link.getAttribute("data-slug");
          // Renderiza el perfil usando solo ese participante (por slug)
          await this.render({ participants: [{ slug }] });
        }
      });
      return;
    }

    // --- Si solo hay 1 participante: renderiza el .md completo ---
    const participant = participantsArr[0];
    if (!participant || !participant.slug) {
      this.rootElement.innerHTML =
        "<p>No se pudo encontrar el archivo del participante.</p>";
      return;
    }

    try {
      const res = await fetch(`/api/participant/${participant.slug}/md`);
      if (!res.ok) throw new Error("No se pudo cargar el archivo md.");
      const md = await res.text();
      // Regex robusto para limpiar frontmatter (al inicio, aunque haya espacios o líneas vacías)
      const cleanMd = md.replace(/^\s*---[\s\S]*?---\s*/m, "");
      const html = window.marked
        ? marked.parse(cleanMd)
        : `<pre>${cleanMd}</pre>`;
      const div = document.createElement("div");
      div.className = "participant-md-full";
      div.style.maxWidth = "800px";
      div.style.margin = "2rem auto";
      div.innerHTML = html;

      this.rootElement.appendChild(div);
    } catch (err) {
      this.rootElement.innerHTML =
        "<p>No se pudo cargar el perfil del participante.</p>";
    }
  }
}

export default ParticipantView;