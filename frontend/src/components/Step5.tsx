import { useDispatch, useSelector } from 'react-redux';
import { prevStep, resetForm } from '../store';
import type { RootState } from '../store';
import { submitInscripcion } from '../api';
import { useState } from 'react';
import { CheckCircle, AlertCircle, User, GraduationCap, BookOpen, Send, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export const Step5 = () => {
  const dispatch = useDispatch();
  const formState = useSelector((state: RootState) => state.form);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await submitInscripcion(formState);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al enviar el formulario");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    dispatch(resetForm());
    setSuccess(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-8 py-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center text-green-600 shadow-xl shadow-green-200">
            <CheckCircle size={48} strokeWidth={3} />
          </div>
        </div>
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">¡Inscripción Exitosa!</h2>
            <p className="text-slate-600 text-lg">Tu inscripción ha sido registrada correctamente.</p>
        </div>
        <button 
            onClick={handleReset} 
            className="bg-sky-600 text-white px-8 py-3 rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-300 font-bold transform active:scale-95"
        >
          Nueva Inscripción
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-sky-200 text-sky-700 flex items-center justify-center font-bold text-sm">5</div>
        <h2 className="text-xl font-bold text-slate-900">Revisión Final</h2>
      </div>

      <div className="space-y-6">
        {/* Datos Personales */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <User className="text-sky-600" size={20} />
                <h3 className="font-bold text-slate-800">Datos Personales</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Nombre Completo</p>
                    <p className="font-medium text-slate-800">{formState.alumno.apellido}, {formState.alumno.nombre}</p>
                </div>
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">DNI</p>
                    <p className="font-medium text-slate-800">{formState.alumno.dni}</p>
                </div>
                <div className="md:col-span-2">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Email Institucional</p>
                    <p className="font-medium text-slate-800">{formState.alumno.email}</p>
                </div>
            </div>
        </div>

        {/* Datos Académicos */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <GraduationCap className="text-sky-600" size={20} />
                <h3 className="font-bold text-slate-800">Información Académica</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="md:col-span-2">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Carrera</p>
                    <p className="font-medium text-slate-800">{formState.academico.nombre_carrera || formState.academico.id_carrera}</p>
                </div>
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Año de Cursada</p>
                    <p className="font-medium text-slate-800">{formState.academico.nombre_anio || formState.academico.id_anio}</p>
                </div>
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Cohorte</p>
                    <p className="font-medium text-slate-800">{formState.academico.cohorte}</p>
                </div>
            </div>
        </div>

        {/* Materias */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <BookOpen className="text-sky-600" size={20} />
                <h3 className="font-bold text-slate-800">Materias a Inscribir</h3>
            </div>
            <ul className="space-y-3">
                {formState.inscripciones.map((insc, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-slate-100 p-3 rounded-lg border border-slate-200">
                        <span className="font-medium text-slate-800 text-sm">{insc.nombre_materia}</span>
                        <span className={clsx(
                            "text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide",
                            insc.condicion === 'regular' ? "bg-sky-200 text-sky-800" : "bg-orange-100 text-orange-700"
                        )}>
                            {insc.condicion}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-100 text-red-800 rounded-xl border border-red-200 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} className="shrink-0" />
          <span className="font-medium text-sm">{error}</span>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button 
            type="button" 
            onClick={() => dispatch(prevStep())} 
            className="bg-white text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-100 border border-slate-300 font-bold transition-all active:scale-95 disabled:opacity-50" 
            disabled={loading}
        >
          Atrás
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="bg-sky-600 text-white px-8 py-3 rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-300 font-bold disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95 flex items-center gap-2"
        >
          {loading ? (
            <>
                <Loader2 size={20} className="animate-spin" />
                <span>Enviando...</span>
            </>
          ) : (
            <>
                <span>Confirmar Inscripción</span>
                <Send size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
