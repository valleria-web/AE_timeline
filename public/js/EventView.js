// js/EventView.js

class EventView {
  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  async render(data, searchQuery = "") {
    this.rootElement.innerHTML = "";
    let eventsArr = [];

    if (Array.isArray(data.events)) {
      eventsArr = data.events;
    } else if (Array.isArray(data.years)) {
      data.years.forEach((yearObj) => {
        if (Array.isArray(yearObj.events)) {
          yearObj.events.forEach((evt) => eventsArr.push(evt));
        }
      });
    } else if (data.slug && data.title) {
      eventsArr = [data];
    }

    if (!eventsArr.length) {
      this.rootElement.innerHTML = "<p>No se encontraron eventos.</p>";
      return;
    }

    if (eventsArr.length > 1) {
      const ul = document.createElement("ul");
      ul.className = "events-list-simple";
      ul.style.fontSize = "1.2rem";
      ul.style.lineHeight = "1.8";
      ul.style.margin = "2.5rem auto";
      ul.style.maxWidth = "540px";
      ul.style.padding = "0 0 2.5rem 0";
      eventsArr.forEach((evt) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#/evento/${evt.slug}" data-slug="${
          evt.slug
        }"><b>${evt.title || evt.slug}</b></a>`;

        ul.appendChild(li);
      });
      this.rootElement.appendChild(ul);

      // Al hacer click en el nombre del evento, carga el md completo
      ul.addEventListener("click", async (e) => {
        const link = e.target.closest("a[data-slug]");
        if (link) {
          e.preventDefault();
          const slug = link.getAttribute("data-slug");
          // Cambia el hash en la URL para navegación SPA
          window.location.hash = `#/evento/${slug}`;
        }
      });

      return;
    }

    // Si solo hay 1 evento: renderiza el .md completo (sin metadatos)
    const event = eventsArr[0];
    if (!event || !event.slug) {
      this.rootElement.innerHTML =
        "<p>No se pudo encontrar el archivo del evento.</p>";
      return;
    }

    try {
      const res = await fetch(`/api/events/${event.slug}/md`);
      if (!res.ok) throw new Error("No se pudo cargar el archivo md.");
      const md = await res.text();
      const cleanMd = md.replace(/^\s*---[\s\S]*?---\s*/m, "");
      const html = window.marked
        ? marked.parse(cleanMd)
        : `<pre>${cleanMd}</pre>`;
      const div = document.createElement("div");
      div.className = "event-md-full";
      div.style.maxWidth = "800px";
      div.style.margin = "2rem auto";
      div.innerHTML = html;

      this.rootElement.appendChild(div);
    } catch (err) {
      this.rootElement.innerHTML =
        "<p>No se pudo cargar el perfil del evento.</p>";
    }
  }
}

export default EventView;