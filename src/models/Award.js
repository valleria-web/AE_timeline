class Award{
    constructor(slug, name, description){
        this.slug = slug;
        this.name = name;
        this.description = description;
    }

    getData(){
        return{
            slug: this.slug,
            name: this.name,
            description: this.description
        }
    }
}

export default Award;