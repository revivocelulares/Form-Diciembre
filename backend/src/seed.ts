import { db } from "./db";

const schema = `
CREATE TABLE IF NOT EXISTS carreras (
    id_carrera INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS anos_cursada (
    id_anio INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    orden INTEGER NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS materias (
    id_materia INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    id_carrera INTEGER NOT NULL,
    id_anio INTEGER NOT NULL,
    FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera),
    FOREIGN KEY (id_anio) REFERENCES anos_cursada(id_anio),
    UNIQUE (nombre, id_carrera, id_anio),
    UNIQUE (id_carrera, id_anio, id_materia)
);

CREATE TABLE IF NOT EXISTS estudiantes (
    id_estudiante INTEGER PRIMARY KEY AUTOINCREMENT,
    dni TEXT NOT NULL UNIQUE,
    apellido TEXT NOT NULL,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dni ON estudiantes (dni);

CREATE TABLE IF NOT EXISTS inscripciones_examenes (
    id_inscripcion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_estudiante INTEGER NOT NULL,
    id_carrera INTEGER NOT NULL,
    id_anio INTEGER NOT NULL,
    id_materia INTEGER NOT NULL,
    cohorte INTEGER NOT NULL,
    condicion TEXT NOT NULL CHECK(condicion IN ('libre', 'regular')),
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_estudiante) REFERENCES estudiantes(id_estudiante),
    FOREIGN KEY (id_carrera, id_anio, id_materia) 
        REFERENCES materias(id_carrera, id_anio, id_materia)
);
`;

async function seed() {
  console.log("Inicializando base de datos...");
  
  // Limpiar tablas antiguas si existen para asegurar esquema correcto
  await db.execute("DROP TABLE IF EXISTS inscripciones_examenes");
  await db.execute("DROP TABLE IF EXISTS materias");
  await db.execute("DROP TABLE IF EXISTS carreras");
  await db.execute("DROP TABLE IF EXISTS anos_cursada");
  await db.execute("DROP TABLE IF EXISTS estudiantes");

  // Ejecutar esquema
  await db.executeMultiple(schema);

  // Insertar Carreras
  try {
    await db.execute({
        sql: "INSERT OR IGNORE INTO carreras (nombre, descripcion) VALUES (?, ?)",
        args: ["Producción de Multimedios", "Tecnicatura Superior en Producción de Multimedios"]
    });
    await db.execute({
        sql: "INSERT OR IGNORE INTO carreras (nombre, descripcion) VALUES (?, ?)",
        args: ["Gestión de Energías Renovables", "Tecnicatura Superior en Gestión de Energías Renovables"]
    });
    await db.execute({
        sql: "INSERT OR IGNORE INTO carreras (nombre, descripcion) VALUES (?, ?)",
        args: ["Petróleo y Gas", "Tecnicatura Superior en Petróleo y Gas"]
    });
    await db.execute({
        sql: "INSERT OR IGNORE INTO carreras (nombre, descripcion) VALUES (?, ?)",
        args: ["Mantenimiento Industrial", "Tecnicatura Superior en Mantenimiento Industrial"]
    });
    await db.execute({
        sql: "INSERT OR IGNORE INTO carreras (nombre, descripcion) VALUES (?, ?)",
        args: ["Logística", "Tecnicatura Superior en Logística"]
    });
    await db.execute({
        sql: "INSERT OR IGNORE INTO carreras (nombre, descripcion) VALUES (?, ?)",
        args: ["Producción Industrial de Alimentos", "Tecnicatura Superior en Producción Industrial de Alimentos"]
    });
    await db.execute({
        sql: "INSERT OR IGNORE INTO carreras (nombre, descripcion) VALUES (?, ?)",
        args: ["Confección de Indumentaria y Productos Textiles", "Tecnicatura Superior en Confección de Indumentaria y Productos Textiles"]
    });
    await db.execute({
        sql: "INSERT OR IGNORE INTO carreras (nombre, descripcion) VALUES (?, ?)",
        args: ["Gestión Administrativa orientada a la producción", "Tecnicatura Superior en Gestión Administrativa orientada a la producción"]
    });
  } catch (e) {
      console.log("Carreras ya existen o error:", e);
  }

  // Insertar Años
  try {
      const anios = [
          { nombre: "1er Año", orden: 1 },
          { nombre: "2do Año", orden: 2 },
          { nombre: "3er Año", orden: 3 }
      ];
      for (const anio of anios) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO anos_cursada (nombre, orden) VALUES (?, ?)",
            args: [anio.nombre, anio.orden]
        });
      }
  } catch (e) { console.log("Años ya existen"); }

  // Insertar Materias (Ejemplo)
  try {
      // Obtener IDs (Asumiendo orden de inserción para este ejemplo simple)
      // En un caso real haríamos SELECT. Aquí asumo IDs 1, 2, 3...
      
      // Materias 1er Año Producción de Multimedios (id_carrera=1, id_anio=1)
      const materias_PM_1 = ["Política y Derecho a la Comunicación", 
                            "Psicología de la Comunicación", 
                            "Historia de los Medios y Sistemas de Comunicación", 
                            "Redacción y Lenguaje Digital",
                            "Géneros Radiales y Televisivos",
                            "Introducción a los Multimedios",
                            "Realización Audiovisual"];
      for (const mat of materias_PM_1) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 1, 1]
        });
      }

      // Materias 2do Año Producción de Multimedios (id_carrera=1, id_anio=2)
      const materias_PM_2 = ["Inglés Técnico", 
                            "Técnicas de Investigación en la Producción de Multimedios", 
                            "Lenguaje Radiofónico", 
                            "Medios Interactivos",
                            "Lenguaje, Edición y Montaje Audiovisual",
                            "Fotografía e Imagen Digital",
                            "Expresión Oral y Doblaje"];
      for (const mat of materias_PM_2) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 1, 2]
        });
      }

      // Materias 3er Año Producción de Multimedios (id_carrera=1, id_anio=3)
      const materias_PM_3 = ["Gestión y Estrategias Comunicacionales", 
                            "Periodismo Digital", 
                            "Diseño Gráfico", 
                            "Producciones Audiovisuales",
                            "Marketing y Publicidad Digital",
                            "Práctica Profesional Integral"];
      for (const mat of materias_PM_3) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 1, 3]
        });
      }

      // Materias 1er Año Energías Renovables (id_carrera=2, id_anio=1)
      const materias_ER_1 = ["Comunicación Oral y Escrita", 
                            "Problemáticas Socioculturales Contemporáneas", 
                            "Análisis Matemático", 
                            "Física",
                            "Química",
                            "Materiales y Procesos Productivos",
                            "Electrotécnica",
                            "Introducción a las Energías Renovables"];
      for (const mat of materias_ER_1) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 2, 1]
        });
      }

      // Materias 2do Año Energías Renovables (id_carrera=2, id_anio=2)
      const materias_ER_2 = ["Tecnologías de la Información y la Representación", 
                            "Probabilidad y Estadística", 
                            "Gestión Ambiental", 
                            "Instalaciones Eléctricas",
                            "Instalaciones Térmicas y Fluidos",
                            "Energía Hidráulica",
                            "Energía Solar",
                            "Práctica Profesionalizante I"];
      for (const mat of materias_ER_2) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 2, 2]
        });
      }

      // Materias 3er Año Energías Renovables (id_carrera=2, id_anio=3)
      const materias_ER_3 = ["Ética y Formación Profesional", 
                            "Seguridad Ocupacional", 
                            "Automatización", 
                            "Gestión de las Energías Renovables",
                            "Instalaciones de Energías Renovables",
                            "Energía Eólica",
                            "Energía de la Biomasa",
                            "Práctica Profesionalizante II"];
      for (const mat of materias_ER_3) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 2, 3]
        });
      }

      // Materias 1er Año Petróleo y Gas (id_carrera=3, id_anio=1)
      const materias_PyG_1 = ["Química", 
                            "Inglés Técnico", 
                            "Informática Aplicada", 
                            "Matemática",
                            "Física General",
                            "Introducción a la Industria de Hidrocarburos",
                            "Geología y Reservorios",
                            "Ambiente en Yacimientos"];
      for (const mat of materias_PyG_1) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 3, 1]
        });
      }

      // Materias 2do Año Petróleo y Gas (id_carrera=3, id_anio=2)
      const materias_PyG_2 = ["Estática y Resistencia de Materiales", 
                            "Mecánica de Fluidos", 
                            "Mediciones e Instalaciones Eléctricas", 
                            "Automatismos y Control",
                            "Termodinámica y Máquinas Térmicas",
                            "Perforación y Terminación de Pozos",
                            "Sistemas Integrados de Gestión",
                            "Instalaciones de Superficie de Producción"];
      for (const mat of materias_PyG_2) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 3, 2]
        });
      }

      // Materias 3er Año Petróleo y Gas (id_carrera=3, id_anio=3)
      const materias_PyG_3 = ["Evaluación de Proyectos", 
                            "Captación y Tratamiento de Gas", 
                            "Producción", 
                            "Recuperación Asistida",
                            "Mantenimiento y Confiabilidad",
                            "Seguridad en Yacimientos",
                            "Formación y Desarrollo Profesional",
                            "Práctica Profesional Integral"];
      for (const mat of materias_PyG_3) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 3, 3]
        });
      }

      // Materias 1er Año Mantenimiento Industrial (id_carrera=4, id_anio=1)
      const materias_MI_1 = ["Informática", 
                            "Inglés", 
                            "Matemática", 
                            "Física",
                            "Química",
                            "Mantenimiento Industrial"];
      for (const mat of materias_MI_1) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 4, 1]
        });
      }

      // Materias 2do Año Mantenimiento Industrial (id_carrera=4, id_anio=2)
      const materias_MI_2 = ["Sistemas de Representación Gráfica", 
                            "Probabilidad y Estadística", 
                            "Tecnología Mecánica y de los Materiales", 
                            "Metrología y Mediciones Eléctricas",
                            "Tecnología del Frío y del Calor",
                            "Electrotecnia",
                            "Instalaciones, Máquinas y Equipos Industriales"];
      for (const mat of materias_MI_2) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 4, 2]
        });
      }

      // Materias 3er Año Mantenimiento Industrial (id_carrera=4, id_anio=3)
      const materias_MI_3 = ["Hidráulica y Neumática", 
                            "Logística", 
                            "Seguridad, Higiene y Protección Ambiental", 
                            "Motores de combustión",
                            "Técnicas Modernas de Mantenimiento",
                            "Electrónica, Automatismos y Control",
                            "Instalaciones Eléctricas",
                            "Electricidad",
                            "Soldadura",
                            "Máquinas - Herramientas",
                            "Formación y Desarrollo Profesional",
                            "Práctica Profesional Integral"];
      for (const mat of materias_MI_3) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 4, 3]
        });
      }

      // Materias 1er Año Logística (id_carrera=5, id_anio=1)
      const materias_L_1 = ["Problemáticas Socioculturales Contemporáneas",
                            "Inglés", 
                            "Informática", 
                            "Análisis Matemático",
                            "Economía",
                            "Seguridad e Higiene",
                            "Logística I",
                            "Derecho del Transporte"];
      for (const mat of materias_L_1) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 5, 1]
        });
      }

      // Materias 2do Año Logística (id_carrera=5, id_anio=2)
      const materias_L_2 = ["Probabilidad y Estadística",
                            "Inglés Técnico", 
                            "Logística II", 
                            "Proyección Presupuestaria y Costos",
                            "Derecho en Logística y Normativa Aduanera",
                            "Gestión de Compras y Contrataciones",
                            "Gestión del Transporte",
                            "Práctica Informática vinculada a la Logística"];
      for (const mat of materias_L_2) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 5, 2]
        });
      }

      // Materias 3er Año Logística (id_carrera=5, id_anio=3)
      const materias_L_3 = ["Ética y Formación Profesional",
                            "Administración de Operaciones Logísticas", 
                            "Procesos Industriales Asociados", 
                            "Sistemas Integrados de Gestión",
                            "Control Estadístico de Procesos",
                            "Gestión de Almacenes",
                            "Estrategia Logística",
                            "Práctica Profesional Integral"];
      for (const mat of materias_L_3) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 5, 3]
        });
      }

      // Materias 1er Año Alimentos (id_carrera=6, id_anio=1)
      const materias_A_1 = ["Informática",
                            "Matemática", 
                            "Química General", 
                            "Física General",
                            "Biología Celular",
                            "Producción Alimentaria",
                            "Tecnología de los Alimentos"];
      for (const mat of materias_A_1) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 6, 1]
        });
      }

      // Materias 2do Año Alimentos (id_carrera=6, id_anio=2)
      const materias_A_2 = ["Inglés",
                            "Control de los Procesos y Automatismos", 
                            "Procesos Productivos", 
                            "Estadística",
                            "Química de los Alimentos",
                            "Microbiología de los Alimentos",
                            "Tecnología de la Producción",
                            "Laboratorio de Producción de Conservas",
                            "Laboratorio de Producción de Confituras"];
      for (const mat of materias_A_2) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 6, 2]
        });
      }

      // Materias 3er Año Alimentos (id_carrera=6, id_anio=3)
      const materias_A_3 = ["Logística",
                            "Gestión de la Calidad y la Inocuidad de los Alimentos", 
                            "Bromatología", 
                            "Proyecto Industrial",
                            "Laboratorio de Producción Industrial",
                            "Toxicología Alimentaria",
                            "Formación y Desarrollo Profesional",
                            "Práctica Profesional Integral"];
      for (const mat of materias_A_3) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 6, 3]
        });
      }

      // Materias 1er Año Indumentaria (id_carrera=7, id_anio=1)
      const materias_IyT_1 = ["Matemática",
                            "Inglés I", 
                            "Tecnologías de la Información y la Com.", 
                            "Química",
                            "Gestión de las Organizaciones",
                            "Economía de la Empresa",
                            "Procesos Productivos",
                            "Control de Calidad",
                            "Dibujo Técnico",
                            "Moldería I"];
      for (const mat of materias_IyT_1) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 7, 1]
        });
      }

      // Materias 2do Año Indumentaria (id_carrera=7, id_anio=2)
      const materias_IyT_2 = ["Inglés II",
                            "Gestión de Calidad, Seguridad y Ambiente", 
                            "Marco Jurídico Procesos Productivos", 
                            "Tec. de los Materiales y Proc. de Fab. Textil",
                            "Proc. de Prod. y Conf. Textil Industrializada",
                            "Moldería II",
                            "Corte y Confección",
                            "Diseño I"];
      for (const mat of materias_IyT_2) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 7, 2]
        });
      }

      // Materias 3er Año Indumentaria (id_carrera=7, id_anio=3)
      const materias_IyT_3 = ["Informática Apl. a la Ind. de la Confección",
                            "Fibras Textiles", 
                            "Corte Industrial", 
                            "Diseño II",
                            "Proyecto Tecnológico Especifico",
                            "Costura Industrial",
                            "Geometrales",
                            "Planif. y Control de la Producción Textil",
                            "Práctica Profesional Integral"];
      for (const mat of materias_IyT_3) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 7, 3]
        });
      }

      // Materias 1er Año Gestión Administrativa (id_carrera=8, id_anio=1)
      const materias_GA_1 = ["Matemática aplicada con orientación financiera",
                            "Inglés Introductorio", 
                            "Gestión Comercial I", 
                            "Fundamentos de la Administración",
                            "Contabilidad Básica",
                            "Informática aplicada a la gestión administrativa"];
      for (const mat of materias_GA_1) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 8, 1]
        });
      }

      // Materias 2do Año Gestión Administrativa (id_carrera=8, id_anio=2)
      const materias_GA_2 = ["Economía Empresarial",
                            "Estadística", 
                            "Inglés Técnico", 
                            "Derecho Laboral",
                            "Administración de RRHH",
                            "Creatividad e Innovación Empresarial",
                            "Gestión Contable",
                            "Procesos de la Producción Industrial"];
      for (const mat of materias_GA_2) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 8, 2]
        });
      }

      // Materias 3er Año Gestión Administrativa (id_carrera=8, id_anio=3)
      const materias_GA_3 = ["Sistemas de Gestión Integrada de la Calidad",
                            "Costos para la toma de decisiones", 
                            "Derecho Empresarial", 
                            "Seminario de Negociación",
                            "Gestión Comercial II",
                            "Impuestos",
                            "Proyectos de Inversión",
                            "Práctica Profesional Integral"];
      for (const mat of materias_GA_3) {
        await db.execute({
            sql: "INSERT OR IGNORE INTO materias (nombre, id_carrera, id_anio) VALUES (?, ?, ?)",
            args: [mat, 8, 3]
        });
      }
  } catch (e) { console.log("Materias ya existen"); }

  console.log("Base de datos inicializada correctamente.");
}

seed().catch(console.error);
