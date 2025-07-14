import BaseSearcher from './BaseSearcher.js';

function normalize(str) {
  return str
    ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    : '';
}

class AwardSearcher extends BaseSearcher {
  search(query) {
    const q = normalize(String(query));
    return this.items.filter(award => {
      if (!award) return false;
      // Buscar coincidencias en todos los atributos importantes, incluyendo los ganadores
      const winnersNames = Array.isArray(award.winners)
        ? award.winners.map(w => normalize(String(w.name ?? ''))).join(' ')
        : '';
      const winnersSlugs = Array.isArray(award.winners)
        ? award.winners.map(w => normalize(String(w.slug ?? ''))).join(' ')
        : '';
      const fields = [
        award.slug,
        award.name,
        award.year,
        award.date,
        award.city,
        award.country,
        award.description,
        winnersNames,
        winnersSlugs
      ];
      const combined = fields.map(f => normalize(String(f ?? ''))).join(' ');
      return combined.includes(q);
    });
  }
}

export default AwardSearcher;


