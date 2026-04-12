import { sql } from "./db.js";

sql`
CREATE TABLE item (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(100),
    date DATE DEFAULT CURRENT_DATE,
    category VARCHAR(100)
);
`
.then(() => {
    console.log('Table created successfully!');
})
