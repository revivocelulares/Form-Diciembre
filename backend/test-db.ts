import { db } from "./src/db";

async function test() {
  try {
    console.log("Testing connection...");
    const result = await db.execute("SELECT * FROM carreras");
    console.log("Success:", result.rows);
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

test();
