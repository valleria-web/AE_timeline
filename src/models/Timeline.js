class Timeline{
    constructor(){
        this.years = [];
    }

    addYear(year){
        this.years.push(year);
    }

    getYears(){
        return this.years;
    }
}

export default Timeline;