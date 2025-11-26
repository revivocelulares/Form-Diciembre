import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'https://form-diciembre.vercel.app' }));
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("API Formulario Inscripción Exámenes");
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
