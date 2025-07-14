import BaseSearcher from './BaseSearcher.js';

class YearSearcher extends BaseSearcher {
  search(query) {
    const year = Number(query);
    if (isNaN(year)) return [];
    return this.items.filter(item => item.year === year);
  }
}

export default YearSearcher;