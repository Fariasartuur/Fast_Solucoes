import { sql } from "./db.js";

export class DatabaseMemory {

    #item = new Map (); 

    list() {
       const items = sql`SELECT * FROM item`;
    }

    create(item) {
       
    }

    update(id, item) {
        t
    }

    delete(id) {
        
    }   
}