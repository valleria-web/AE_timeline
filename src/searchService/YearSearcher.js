import BaseSearcher from './BaseSearcher.js';

export default class YearSearcher extends BaseSearcher {
  search(query) {
    const year = Number(query);
    if (isNaN(year)) return [];
    return this.items.filter(item => item.year === year);
  }
}
