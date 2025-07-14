import BaseSearcher from './BaseSearcher.js';

// Normaliza acentos y pasa a minúsculas para buscar sin errores
function normalize(str) {
  return str
    ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    : '';
}

class ParticipantSearcher extends BaseSearcher {
  search(query) {
    const q = normalize(String(query));

    return this.items.filter(participant => {
      if (!participant) return false;

      // Incluye TODOS los campos que pueden tener texto buscable
      const fields = [
        participant.slug,
        participant.name,
        Array.isArray(participant.roles) ? participant.roles.join(' ') : '',
        participant.presentationTitle,
        participant.awardTitle,
        participant.bioSummary,
        participant.presentantionSummary,
        participant.awardSummary,
        participant.image,
        participant.draft ? 'borrador' : '',
        // Incluye eventos y premios por si hay búsqueda cruzada
        ...(Array.isArray(participant.events)
          ? participant.events.map(e => typeof e === 'string'
            ? e
            : [e.title, e.year, e.city, e.country].join(' '))
          : []),
        ...(Array.isArray(participant.awards)
          ? participant.awards.map(a => typeof a === 'string'
            ? a
            : [a.name, a.description].join(' '))
          : [])
      ];

      const combined = fields
        .filter(f => f !== undefined && f !== null)
        .map(f => normalize(String(f)))
        .join(' ');

      return combined.includes(q);
    });
  }
}

export default ParticipantSearcher;