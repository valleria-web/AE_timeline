import YearSearcher from "./YearSearcher.js";

export default class SearchService {
  constructor(data) {
    this.searchers = {
      years: new YearSearcher(data.years),
    };
  }

  searchAll(query) {
    const results = {};
    for (const [key, searcher] of Object.entries(this.searchers)) {
      results[key] = searcher.search(query);
    }
    return results;
  }
}
