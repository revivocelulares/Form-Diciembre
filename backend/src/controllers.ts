import { Request, Response } from "express";
import { db } from "./db";
import { z, ZodError } from "zod";

// Schemas de validación
const inscripcionSchema = z.object({
  alumno: z.object({
    dni: z.string().min(6),
    apellido: z.string().min(2),
    nombre: z.string().min(2),
    email: z.string().email(),
  }),
  academico: z.object({
    id_carrera: z.number(),
    id_anio: z.number(),
    cohorte: z.number().int().min(2000).max(new Date().getFullYear()),
  }),
  inscripciones: z.array(z.object({
    id_materia: z.number(),
    condicion: z.enum(["libre", "regular"]),
  })).min(1),
});

export const getCarreras = async (req: Request, res: Response) => {
  try {
    const result = await db.execute("SELECT * FROM carreras");
    res.json(result.rows);
  } catch (error) {
    console.error("Error getCarreras:", error);
    res.status(500).json({ error: "Error al obtener carreras" });
  }
};

export const getAnios = async (req: Request, res: Response) => {
  try {
    const result = await db.execute("SELECT * FROM anos_cursada ORDER BY orden ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error getAnios:", error);
    res.status(500).json({ error: "Error al obtener años" });
  }
};

export const getMaterias = async (req: Request, res: Response) => {
  const { id_carrera, id_anio } = req.query;
  
  if (!id_carrera || !id_anio) {
    res.status(400).json({ error: "Faltan parámetros id_carrera o id_anio" });
    return;
  }

  try {
    const result = await db.execute({
      sql: "SELECT * FROM materias WHERE id_carrera = ? AND id_anio = ?",
      args: [Number(id_carrera), Number(id_anio)],
    });
    res.json(result.rows);
  } catch (error) {
    console.error("Error getMaterias:", error);
    res.status(500).json({ error: "Error al obtener materias" });
  }
};

export const crearInscripcion = async (req: Request, res: Response) => {
  try {
    const data = inscripcionSchema.parse(req.body);
    const { alumno, academico, inscripciones } = data;

    // 1. Upsert Alumno
    // SQLite upsert: ON CONFLICT(dni) DO UPDATE SET ...
    await db.execute({
      sql: `INSERT INTO estudiantes (dni, apellido, nombre, email) 
            VALUES (?, ?, ?, ?)
            ON CONFLICT(dni) DO UPDATE SET
            apellido = excluded.apellido,
            nombre = excluded.nombre,
            email = excluded.email`,
      args: [alumno.dni, alumno.apellido, alumno.nombre, alumno.email],
    });

    // 2. Obtener ID estudiante
    const estResult = await db.execute({
      sql: "SELECT id_estudiante FROM estudiantes WHERE dni = ?",
      args: [alumno.dni],
    });

    if (estResult.rows.length === 0) throw new Error("Error al recuperar estudiante");
    const id_estudiante = estResult.rows[0].id_estudiante;

    // 3. Insertar inscripciones
    // Hacerlo en transacción o loop simple. LibSQL cliente soporta batch/transaction.
    // Usaremos un loop de promesas para simplificar o executeMultiple si construimos el string, 
    // pero mejor consultas parametrizadas individuales para seguridad.
    
    // Primero validamos que no se inscriba dos veces a la misma mesa en la misma fecha (opcional, pero buena práctica)
    // El modelo sql.md no menciona restricciones de fecha específicas para la inscripción, solo TIMESTAMP.
    
    for (const insc of inscripciones) {
        await db.execute({
            sql: `INSERT INTO inscripciones_examenes 
                  (id_estudiante, id_carrera, id_anio, id_materia, cohorte, condicion)
                  VALUES (?, ?, ?, ?, ?, ?)`,
            args: [
                id_estudiante, 
                academico.id_carrera, 
                academico.id_anio, 
                insc.id_materia, 
                academico.cohorte, 
                insc.condicion
            ]
        });
    }

    res.status(201).json({ message: "Inscripción realizada con éxito" });

  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: (error as any).errors });
    } else {
      console.error(error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
};

export const getInscripciones = async (req: Request, res: Response) => {
  try {
    const sql = `
      SELECT 
        i.id_inscripcion,
        i.fecha_inscripcion,
        i.cohorte,
        i.condicion,
        e.dni,
        e.apellido,
        e.nombre as nombre_alumno,
        e.email,
        c.nombre as carrera,
        a.nombre as anio_cursada,
        m.nombre as materia
      FROM inscripciones_examenes i
      JOIN estudiantes e ON i.id_estudiante = e.id_estudiante
      JOIN carreras c ON i.id_carrera = c.id_carrera
      JOIN anos_cursada a ON i.id_anio = a.id_anio
      JOIN materias m ON i.id_materia = m.id_materia
      ORDER BY i.fecha_inscripcion DESC
    `;
    
    const result = await db.execute(sql);
    res.json(result.rows);
  } catch (error) {
    console.error("Error getInscripciones:", error);
    res.status(500).json({ error: "Error al obtener inscripciones" });
  }
};
