import YearSearcher from "./YearSearcher.js";
import EventSearcher from "./EventSearcher.js";
import ParticipantSearcher from "./ParticipantSearcher.js";
import AwardSearcher from "./AwardSearcher.js";

class SearchService {
  constructor(data) {
    this.searchers = {
      years: new YearSearcher(data.years || []),
      events: new EventSearcher(data.events || []),
      participants: new ParticipantSearcher(data.participants || []),
      awards: new AwardSearcher(data.awards || []),
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

export default SearchService;