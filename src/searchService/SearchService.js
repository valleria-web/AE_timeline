// src/searchService/SearchService.js

import AwardSearcher from "./AwardSearcher.js";
import ParticipantSearcher from "./ParticipantSearcher.js";
import EventSearcher from "./EventSearcher.js";
import YearSearcher from "./YearSearcher.js";

class SearchService {
  constructor({ years, events, participants, awards }) {
    this.years = years;
    this.events = events;
    this.participants = participants;
    this.awards = awards;

    this.yearSearcher = new YearSearcher(years);
    this.eventSearcher = new EventSearcher(events);
    this.participantSearcher = new ParticipantSearcher(participants);
    this.awardSearcher = new AwardSearcher(awards);   // <- ESTO FALTABA
  }

  searchAll(query) {
    return {
      years: this.yearSearcher.search(query),
      events: this.eventSearcher.search(query),
      participants: this.participantSearcher.search(query),
      awards: this.awardSearcher.search(query),
    };
  }
}
export default SearchService;