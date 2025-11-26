# Sistema de Inscripciones I.S.E.T. N° 812 (CeRET Chubut)

Este proyecto es una aplicación web full-stack desarrollada para gestionar el proceso de inscripción de alumnos del **Instituto Superior de Enseñanza Técnica N° 812 - CeRET Chubut**.

El sistema permite a los alumnos completar su inscripción a través de un formulario paso a paso (Wizard) y ofrece a los administradores un panel de control (Dashboard) para visualizar, filtrar y exportar los datos de las inscripciones.

## Características Principales

### 🎓 Para Alumnos (Frontend Público)
- **Formulario Wizard**: Proceso de inscripción guiado en 5 pasos (Datos Personales, Académica, Año de Cursada, Materias, Revisión).
- **Validación en tiempo real**: Uso de Zod y React Hook Form para asegurar la integridad de los datos.
- **Diseño Responsivo**: Interfaz moderna y adaptable a dispositivos móviles utilizando Tailwind CSS.

### 🛡️ Para Administradores (Dashboard Privado)
- **Acceso Seguro**: Autenticación mediante credenciales de administrador.
- **Visualización de Datos**: Tabla interactiva con todos los alumnos inscriptos.
- **Filtros Avanzados**: Filtrado dinámico por Carrera y Año de Cursada (datos obtenidos en tiempo real del backend).
- **Exportación a Excel**: Funcionalidad para descargar los reportes de inscripciones filtradas en formato `.xlsx`.

## 🛠️ Tecnologías Utilizadas

### Frontend (`/frontend`)
- **Framework**: React 19 (con Vite)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Estado**: Redux Toolkit
- **Routing**: React Router DOM
- **Formularios y Validación**: React Hook Form, Zod
- **Iconos**: Lucide React
- **HTTP Client**: Axios
- **Utilidades**: XLSX (SheetJS) para exportación de Excel

### Backend (`/backend`)
- **Runtime**: Node.js
- **Framework**: Express
- **Lenguaje**: TypeScript
- **Base de Datos**: SQLite / LibSQL (@libsql/client)
- **Validación**: Zod
- **Seguridad**: CORS configurado

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js (v18 o superior)
- NPM

### Pasos para ejecutar

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   El servidor iniciará en el puerto configurado (por defecto 3000).

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   La aplicación estará disponible generalmente en `http://localhost:5173`.

## 📂 Estructura del Proyecto

```
/
├── backend/            # API REST y lógica del servidor
│   ├── src/
│   │   ├── controllers.ts  # Controladores de la API
│   │   ├── routes.ts       # Definición de rutas
│   │   └── db.ts           # Conexión a base de datos
│   └── ...
│
├── frontend/           # Aplicación React (SPA)
│   ├── public/         # Assets estáticos (imágenes)
│   ├── src/
│   │   ├── components/ # Componentes reutilizables (Dashboard, FormWizard)
│   │   ├── store/      # Estado global (Redux)
│   │   └── api.ts      # Cliente API
│   └── ...
└── README.md           # Documentación general
```

---
Desarrollado por Diego Ferreira para I.S.E.T. N° 812.
