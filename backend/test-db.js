"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./src/db");
async function test() {
    try {
        console.log("Testing connection...");
        const result = await db_1.db.execute("SELECT * FROM carreras");
        console.log("Success:", result.rows);
    }
    catch (error) {
        console.error("Connection failed:", error);
    }
}
test();
