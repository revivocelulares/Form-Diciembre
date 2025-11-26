import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, updateInscripciones } from '../store';
import type { RootState } from '../store';
import { getMaterias } from '../api';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

const schema = z.object({
  inscripciones: z.array(z.object({
    id_materia: z.number(),
    condicion: z.enum(['libre', 'regular']),
  }))
  .min(1, "Debe inscribirse al menos a una materia")
  .max(3, "Solo puede inscribirse a un máximo de 3 materias"),
});

type FormData = z.infer<typeof schema>;

export const Step4 = () => {
  const dispatch = useDispatch();
  const { academico, inscripciones: storedInscripciones } = useSelector((state: RootState) => state.form);
  const [materias, setMaterias] = useState<any[]>([]);

  useEffect(() => {
    if (academico.id_carrera && academico.id_anio) {
      getMaterias(academico.id_carrera, academico.id_anio)
        .then(res => setMaterias(res.data))
        .catch(console.error);
    }
  }, [academico]);

  const { handleSubmit, formState: { errors, isValid }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      inscripciones: storedInscripciones.map(i => ({
        id_materia: i.id_materia,
        condicion: i.condicion
      }))
    },
    mode: 'onChange'
  });

  // Watch current selection to render UI states
  const currentInscripciones = watch('inscripciones') || [];
  const isMaxReached = currentInscripciones.length >= 3;

  const toggleMateria = (id_materia: number) => {
    const exists = currentInscripciones.find(i => i.id_materia === id_materia);
    if (exists) {
      setValue('inscripciones', currentInscripciones.filter(i => i.id_materia !== id_materia), { shouldValidate: true });
    } else {
      if (!isMaxReached) {
        setValue('inscripciones', [...currentInscripciones, { id_materia, condicion: 'regular' }], { shouldValidate: true });
      }
    }
  };

  const updateCondicion = (id_materia: number, condicion: 'regular' | 'libre') => {
    const updated = currentInscripciones.map(i => 
      i.id_materia === id_materia ? { ...i, condicion } : i
    );
    setValue('inscripciones', updated, { shouldValidate: true });
  };

  const onSubmit = (data: FormData) => {
    const formattedInscripciones = data.inscripciones.map(i => {
      const mat = materias.find(m => m.id_materia === i.id_materia);
      return {
        id_materia: i.id_materia,
        nombre_materia: mat?.nombre || 'Desconocida',
        condicion: i.condicion
      };
    });
    dispatch(updateInscripciones(formattedInscripciones));
    dispatch(nextStep());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-200 text-sky-700 flex items-center justify-center font-bold text-sm">4</div>
          <h2 className="text-xl font-bold text-slate-900">Inscripción a Materias</h2>
        </div>
        <div className={clsx(
          "px-3 py-1 rounded-full text-sm font-bold transition-colors",
          isMaxReached ? "bg-orange-100 text-orange-700" : "bg-slate-200 text-slate-700"
        )}>
          {currentInscripciones.length}/3 Seleccionadas
        </div>
      </div>

      <div className="space-y-4">
        {materias.length === 0 ? (
           <p className="text-slate-600 italic">Cargando materias...</p>
        ) : (
           materias.map(materia => {
             const inscription = currentInscripciones.find(i => i.id_materia === materia.id_materia);
             const isSelected = !!inscription;
             const isDisabled = !isSelected && isMaxReached;

             return (
               <div 
                 key={materia.id_materia}
                 className={clsx(
                   "p-4 rounded-xl border-2 transition-all duration-200",
                   isSelected ? "border-sky-600 bg-sky-100/50" : "border-slate-300 bg-white",
                   isDisabled ? "opacity-50 cursor-not-allowed bg-slate-100" : "hover:border-slate-400"
                 )}
               >
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <label className={clsx("flex items-center gap-3 select-none flex-1", !isDisabled && "cursor-pointer")}>
                     <div className={clsx(
                       "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors",
                       isSelected ? "bg-sky-600 border-sky-600" : "border-slate-400 bg-white",
                       isDisabled && "border-slate-300"
                     )}>
                       {isSelected && <Check size={16} className="text-white" />}
                     </div>
                     <input 
                       type="checkbox" 
                       className="hidden"
                       checked={isSelected}
                       disabled={isDisabled}
                       onChange={() => !isDisabled && toggleMateria(materia.id_materia)}
                     />
                     <span className={clsx(
                       "font-bold text-slate-800",
                       isSelected && "text-sky-800",
                       isDisabled && "text-slate-500"
                     )}>
                       {materia.nombre}
                     </span>
                   </label>

                   {isSelected && (
                     <div className="flex bg-white rounded-lg p-1 border border-slate-300 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                       <button
                         type="button"
                         onClick={() => updateCondicion(materia.id_materia, 'regular')}
                         className={clsx(
                           "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                           inscription?.condicion === 'regular' 
                             ? "bg-sky-200 text-sky-800 shadow-sm" 
                             : "text-slate-600 hover:bg-slate-100"
                         )}
                       >
                         Regular
                       </button>
                       <button
                         type="button"
                         onClick={() => updateCondicion(materia.id_materia, 'libre')}
                         className={clsx(
                           "px-4 py-1.5 rounded-md text-sm font-bold transition-all",
                           inscription?.condicion === 'libre' 
                             ? "bg-orange-100 text-orange-700 shadow-sm" 
                             : "text-slate-600 hover:bg-slate-100"
                         )}
                       >
                         Libre
                       </button>
                     </div>
                   )}
                 </div>
               </div>
             );
           })
        )}
      </div>
      
      {errors.inscripciones && <p className="text-red-600 text-sm font-bold text-center">{errors.inscripciones.message}</p>}
      {isMaxReached && <p className="text-orange-500 text-sm font-bold text-center animate-in fade-in">Has alcanzado el límite de 3 materias.</p>}

      <div className="flex justify-between pt-4">
        <button 
          type="button" 
          onClick={() => dispatch(prevStep())} 
          className="bg-white text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-100 border border-slate-300 font-bold transition-all active:scale-95"
        >
          Atrás
        </button>
        <button 
          type="submit" 
          disabled={!isValid || currentInscripciones.length === 0}
          className="bg-sky-600 text-white px-8 py-3 rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
        >
          Siguiente
        </button>
      </div>
    </form>
  );
};
