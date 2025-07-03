class Award{
    constructor(name, description){
        this.name = name;
        this.description = description;
    }

    getData(){
        return{
            name: this.name,
            description: this.description
        }
    }
}

export default Award;