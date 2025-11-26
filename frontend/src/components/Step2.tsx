import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, prevStep, updateAcademico } from '../store';
import type { RootState } from '../store';
import { getCarreras } from '../api';
import { Check, Calendar, Hash, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

const schema = z.object({
  id_carrera: z.string().min(1, "Seleccione una carrera"),
  cohorte: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 2000, "Cohorte inválida (mínimo 2000)"),
});

type FormData = z.infer<typeof schema>;

export const Step2 = () => {
  const dispatch = useDispatch();
  const academico = useSelector((state: RootState) => state.form.academico);
  const [carreras, setCarreras] = useState<any[]>([]);

  useEffect(() => {
    getCarreras().then(res => setCarreras(res.data)).catch(console.error);
  }, []);

  const { register, handleSubmit, formState: { errors, isValid, dirtyFields } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id_carrera: academico.id_carrera ? String(academico.id_carrera) : '',
      cohorte: String(academico.cohorte),
    },
    mode: 'onChange'
  });

  const onSubmit = (data: FormData) => {
    const carrera = carreras.find(c => c.id_carrera === Number(data.id_carrera));
    dispatch(updateAcademico({
      id_carrera: Number(data.id_carrera),
      nombre_carrera: carrera?.nombre,
      id_anio: academico.id_anio,
      cohorte: Number(data.cohorte),
    }));
    dispatch(nextStep());
  };

  const InputField = ({ label, name, type = "text", icon: Icon }: { label: string, name: keyof FormData, type?: string, icon?: any }) => (
    <div className="space-y-1">
      <label className="block text-sm font-bold text-slate-700 ml-1">{label}</label>
      <div className="relative">
        <input 
          {...register(name)} 
          type={type}
          className={clsx(
            "w-full rounded-xl border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-3 pl-4 pr-10 text-slate-800 transition-all duration-200",
            errors[name] ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-slate-300"
          )}
          placeholder={label}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
          {!errors[name] && dirtyFields[name] && <Check className="text-emerald-600" size={18} />}
          {Icon && <Icon size={18} />}
        </div>
      </div>
      {errors[name] && <p className="text-red-600 text-xs ml-1 font-medium">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-sky-200 text-sky-700 flex items-center justify-center font-bold text-sm">2</div>
        <h2 className="text-xl font-bold text-slate-900">Información Académica</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-1">
            <label className="block text-sm font-bold text-slate-700 ml-1">Carrera</label>
            <div className="relative">
                <select 
                    {...register('id_carrera')} 
                    className={clsx(
                        "w-full rounded-xl border-slate-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 py-3 pl-4 pr-10 text-slate-800 appearance-none bg-white transition-all duration-200",
                        errors.id_carrera ? "border-red-400" : "border-slate-300"
                    )}
                >
                    <option value="">Seleccione una carrera...</option>
                    {carreras.map(c => (
                        <option key={c.id_carrera} value={c.id_carrera}>{c.nombre}</option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                    <ChevronDown size={18} />
                </div>
            </div>
            {errors.id_carrera && <p className="text-red-600 text-xs ml-1 font-medium">{errors.id_carrera.message}</p>}
        </div>

        <div className="grid grid-cols-1">
           <InputField label="Cohorte (Año)" name="cohorte" type="number" icon={Calendar} />
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
