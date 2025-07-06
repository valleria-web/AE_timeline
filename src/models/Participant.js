class Participant {
    constructor({
        slug,
        name,
        roles,
        date,
        img,
        description,
        summary,
        tags,
        title,
        draft
    }) {
        this.slug = slug;
        this.name = name;
        this.roles = roles;
        this.date = date;
        this.img = img;
        this.description = description;
        this.summary = summary;
        this.tags = tags;
        this.title = title;
        this.draft = draft;
        this.events = [];
        this.awards = [];
    }

    addEvent(event) {
        this.events.push(event);
    }

    addAward(award) {
        this.awards.push(award);
    }

    getData() {
        return {
            name: this.name,
            slug: this.slug,
            roles: this.roles,
            date: this.date,
            img: this.img,
            description: this.description,
            summary: this.summary,
            tags: this.tags,
            title: this.title,
            draft: this.draft,
            events: this.events.map(event =>
                typeof event.getData === "function" ? event.getData() : event
            ),
            awards: this.awards.map(award =>
                typeof award.getData === "function" ? award.getData() : award
            )
        };
    }
}

export default Participant;

