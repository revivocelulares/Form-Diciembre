import axios from 'axios';

const api = axios.create({
  baseURL: 'https://form-diciembre.onrender.com/api',
});

export const getCarreras = () => api.get('/carreras');
export const getAnios = () => api.get('/anios');
export const getMaterias = (id_carrera: number, id_anio: number) => 
  api.get('/materias', { params: { id_carrera, id_anio } });

export const submitInscripcion = (data: any) => api.post('/inscripciones', data);

export const getInscripciones = () => api.get('/inscripciones');

export default api;
