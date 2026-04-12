export class DatabaseMemory {

    #item = new Map (); 

    list() {
        return Array.from(this.#item.entries()).map(itemArray => {
            const id = itemArray[0];
            const data = itemArray[1];

            return {
                id,
                ...data
            }

        });
    }

    create(item) {
        const  itemid = crypto.randomUUID();
        
        this.#item.set(itemid, item);
    }

    update(id, item) {
        this.#item.set(id, item);
    }

    delete(id) {
        this.#item.delete(id);
    }   
}