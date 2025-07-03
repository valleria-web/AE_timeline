import Timeline from "../models/Timeline.js";
import Year from "../models/Year.js";
import Event from "../models/Event.js";
import Participant from "../models/Participant.js";
import Award from "../models/Award.js";
import TimelineView from "../views/TimelineView.js";

class App {
  constructor() {
    this.timeline = new Timeline();
  }

  init() {
    const timeline = new Timeline();
    const y_2008 = new Year(2008);
    const event_1 = new Event(
      "Graduacao 2008",
      "10/10/2008",
      "Dourados",
      "Brasil"
    );

    const award_1 = new Award("Medalha de Ouro", "Premio a melhor palestra");

    const anna = new Participant("Anna Maria");
    anna.addEvent(event_1);
    anna.addAward(award_1);

    y_2008.addEvent(event_1);
    event_1.addParticipant(anna);

    timeline.addYear(y_2008);

    //console.log(timeline.getYears());
    //console.log(y_2008.getEvents());
    //console.log(event_1.getParticipant());
    console.log(anna.getData());

  }
}

export default App;

const app = new App();
const timeline = app.init();