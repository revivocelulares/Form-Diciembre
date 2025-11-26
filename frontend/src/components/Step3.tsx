import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, updateAcademico } from '../store';
import type { RootState } from '../store';
import { getAnios } from '../api';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

const schema = z.object({
  id_anio: z.string().min(1, "Seleccione un año de cursada"),
});

type FormData = z.infer<typeof schema>;

export const Step3 = () => {
  const dispatch = useDispatch();
  const academico = useSelector((state: RootState) => state.form.academico);
  const [anios, setAnios] = useState<any[]>([]);

  useEffect(() => {
    getAnios().then(res => setAnios(res.data)).catch(console.error);
  }, []);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id_anio: academico.id_anio ? String(academico.id_anio) : '',
    },
    mode: 'onChange'
  });

  const onSubmit = (data: FormData) => {
    const anio = anios.find(a => a.id_anio === Number(data.id_anio));
    dispatch(updateAcademico({
      ...academico,
      id_anio: Number(data.id_anio),
      nombre_anio: anio?.nombre,
    }));
    dispatch(nextStep());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-sky-200 text-sky-700 flex items-center justify-center font-bold text-sm">3</div>
        <h2 className="text-xl font-bold text-slate-900">Año de Cursada</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="space-y-1">
            <label className="block text-sm font-bold text-slate-700 ml-1">Año que cursa actualmente</label>
            <div className="relative">
                <select 
                    {...register('id_anio')} 
                    className={clsx(
                        "w-full rounded-xl border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-3 pl-4 pr-10 text-slate-800 appearance-none bg-white transition-all duration-200",
                        errors.id_anio ? "border-red-400" : "border-slate-300"
                    )}
                >
                    <option value="">Seleccione un año...</option>
                    {anios.map(a => (
                        <option key={a.id_anio} value={a.id_anio}>{a.nombre}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                    <ChevronDown size={18} />
                </div>
            </div>
            {errors.id_anio && <p className="text-red-600 text-xs ml-1 font-medium">{errors.id_anio.message}</p>}
        </div>
      </div>

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
          disabled={!isValid}
          className="bg-sky-600 text-white px-8 py-3 rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
        >
          Siguiente
        </button>
      </div>
    </form>
  );
};
