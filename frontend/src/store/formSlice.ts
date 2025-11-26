import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Alumno {
  dni: string;
  apellido: string;
  nombre: string;
  email: string;
}

export interface Academico {
  id_carrera: number;
  nombre_carrera?: string;
  id_anio: number;
  nombre_anio?: string;
  cohorte: number;
}

export interface InscripcionMateria {
  id_materia: number;
  nombre_materia: string;
  condicion: 'libre' | 'regular';
}

export interface FormState {
  step: number;
  alumno: Alumno;
  academico: Academico;
  inscripciones: InscripcionMateria[];
}

const initialState: FormState = {
  step: 1,
  alumno: { dni: '', apellido: '', nombre: '', email: '' },
  academico: { id_carrera: 0, id_anio: 0, cohorte: new Date().getFullYear() },
  inscripciones: [],
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    nextStep: (state) => { state.step += 1; },
    prevStep: (state) => { state.step -= 1; },
    setStep: (state, action: PayloadAction<number>) => { state.step = action.payload; },
    updateAlumno: (state, action: PayloadAction<Alumno>) => { state.alumno = action.payload; },
    updateAcademico: (state, action: PayloadAction<Academico>) => { state.academico = { ...state.academico, ...action.payload }; },
    updateInscripciones: (state, action: PayloadAction<InscripcionMateria[]>) => { state.inscripciones = action.payload; },
    resetForm: () => initialState,
  },
});

export const { nextStep, prevStep, setStep, updateAlumno, updateAcademico, updateInscripciones, resetForm } = formSlice.actions;
export default formSlice.reducer;
