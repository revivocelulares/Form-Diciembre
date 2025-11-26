import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { nextStep, updateAlumno } from '../store';
import type { RootState } from '../store';
import { Check, Mail } from 'lucide-react';
import { clsx } from 'clsx';

const schema = z.object({
  apellido: z.string().min(2, "El apellido es requerido"),
  nombre: z.string().min(2, "El nombre es requerido"),
  dni: z.string().min(6, "DNI inválido"),
  email: z.string().email("Email inválido"),
});

type FormData = z.infer<typeof schema>;

export const Step1 = () => {
  const dispatch = useDispatch();
  const alumno = useSelector((state: RootState) => state.form.alumno);
  
  const { register, handleSubmit, formState: { errors, isValid, dirtyFields } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: alumno,
    mode: 'onChange'
  });

  const onSubmit = (data: FormData) => {
    dispatch(updateAlumno(data));
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
        <div className="w-8 h-8 rounded-lg bg-sky-200 text-sky-700 flex items-center justify-center font-bold text-sm">1</div>
        <h2 className="text-xl font-bold text-slate-900">Datos Personales</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <InputField label="Apellido" name="apellido" />
           <InputField label="Nombre" name="nombre" />
        </div>

        <InputField label="DNI" name="dni" />
        <InputField label="Email de Contacto" name="email" type="email" icon={Mail} />
      </div>

      <div className="flex justify-end pt-4">
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
