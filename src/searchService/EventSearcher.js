class EventSearcher {
  constructor(events) {
    this.events = events;
  }

  search(query) {
    const q = String(query).trim().toLowerCase();
    if (!q) return this.events;

    // Solo busca en título, slug, descripción, ciudad, país
    return this.events.filter(evt => {
      return (
        (evt.title && evt.title.toLowerCase().includes(q)) ||
        (evt.slug && evt.slug.toLowerCase().includes(q)) ||
        (evt.description && evt.description.toLowerCase().includes(q)) ||
        (evt.city && evt.city.toLowerCase().includes(q)) ||
        (evt.country && evt.country.toLowerCase().includes(q))
      );
    });
  }
}
export default EventSearcher;