class Participant{
    constructor(name){
        this.name = name;
        this.role = "";
        this.img = "";
        this.events = [];
        this.awards = [];
    }

    addEvent(event){
        this.events.push(event);
    }

    addAward(award){
        this.awards.push(award);
    }

    getData(){
        return{
            name: this.name,
            role: this.role,
            img: this.img,
            events: this.events,
            award: this.awards
        }
    }
}

export default Participant;