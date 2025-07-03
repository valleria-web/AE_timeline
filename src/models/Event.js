class Event{
    constructor(title, date, city, country){
        this.title = title;
        this.date = date;
        this.city = city;
        this.country = country;
        this.participants = [];
    }

    addParticipant(participant){
        this.participants.push(participant);
    }

    getParticipant(){
        return this.participants;
    }
}

export default Event;