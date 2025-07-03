class Year{
    constructor(value){
        this.value = value;
        this.events = [];
    }

    addEvent(event){
        this.events.push(event);
    }

    getEvents(){
        return this.events;
    }
}

export default Year;