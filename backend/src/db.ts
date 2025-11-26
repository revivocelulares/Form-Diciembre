import { createClient } from "@libsql/client";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.TURSO_DATABASE_URL || "libsql://inscripciones-revivocelulares.aws-us-west-2.turso.io";
const authToken = process.env.TURSO_AUTH_TOKEN;

console.log("DB Config:", { url, authToken: authToken ? "Set" : "None" });

export const db = createClient({
  url,
  authToken,
});
