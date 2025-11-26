import { Router } from "express";
import { getCarreras, getAnios, getMaterias, crearInscripcion, getInscripciones } from "./controllers";

export const router = Router();

router.get("/carreras", getCarreras);
router.get("/anios", getAnios);
router.get("/materias", getMaterias);
router.post("/inscripciones", crearInscripcion);
router.get("/inscripciones", getInscripciones);
