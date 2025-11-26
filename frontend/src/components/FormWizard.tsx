import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { Step4 } from './Step4';
import { Step5 } from './Step5';
import { GraduationCap, Calendar, CheckSquare, Send, User, Lock, X } from 'lucide-react';
import { clsx } from 'clsx';

export function FormWizard() {
  const step = useSelector((state: RootState) => state.form.step);
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const steps = [
    { num: 1, title: 'Datos Personales', icon: User },
    { num: 2, title: 'Académica', icon: GraduationCap },
    { num: 3, title: 'Año Cursada', icon: Calendar },
    { num: 4, title: 'Materias', icon: CheckSquare },
    { num: 5, title: 'Revisión', icon: Send },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'Admin1234') {
      navigate('/admin');
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-sky-100 font-sans text-slate-700 relative">
      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-sky-800 p-6 flex justify-between items-center">
              <h2 className="text-white text-xl font-bold flex items-center gap-2">
                <Lock size={20} /> Acceso Administrativo
              </h2>
              <button 
                onClick={() => setIsLoginOpen(false)}
                className="text-sky-200 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Usuario</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese usuario"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Contraseña</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese contraseña"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-200 hover:shadow-sky-300 active:scale-[0.98]"
              >
                Ingresar al Dashboard
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header Institucional */}
      <header className="bg-sky-50 py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center shadow-sm border-b border-sky-200 relative overflow-hidden">
        {/* Decorative background element if needed, or just keep simple */}
        
        {/* Left Logo */}
        <div className="mb-4 md:mb-0 z-10">
          <img 
            src="/images/logo-transparente.png" 
            alt="Logo ISET 812" 
            className="h-24 w-auto object-contain drop-shadow-sm"
          />
        </div>

        {/* Center Text */}
        <div className="text-center flex-1 px-4 z-10">
           <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">I.S.E.T. N° 812</h1>
           <p className="text-slate-600 font-semibold text-base md:text-lg mt-1 tracking-wide">Inscripción a Mesas de Examen - Diciembre 2025</p>
        </div>
        
        {/* Right Logo */}
        <div className="mt-4 md:mt-0 z-10 flex flex-col items-end gap-2">
          <img 
            src="/images/logo-iset-812-ceret.png" 
            alt="Logo CeRET" 
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Admin Button - Absolute Top Right */}
        <button 
          onClick={() => setIsLoginOpen(true)}
          className="absolute top-2 right-2 text-slate-400 hover:text-sky-700 transition-colors p-2 z-20"
          title="Acceso Administrativo"
        >
          <Lock size={14} />
        </button>
      </header>

      <main className="container mx-auto max-w-4xl py-8 px-4">
        {/* Main Card Container */}
        <div className="bg-white rounded-4xl shadow-xl shadow-sky-300/50 overflow-hidden border border-slate-300">
           
           {/* Progress Bar */}
           <div className="px-8 py-10 border-b border-slate-300 bg-white hidden md:block">
              <div className="flex justify-between items-center relative max-w-3xl mx-auto">
                 {/* Line */}
                 <div className="absolute top-1/2 left-0 w-full h-0.5 bg-sky-300 z-0"></div>
                 
                 {steps.map((s) => (
                    <div key={s.num} className="relative z-10 flex flex-col items-center group cursor-default">
                       <div className={clsx(
                         "w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md transition-all duration-300 ring-4 ring-white",
                         step >= s.num 
                           ? "bg-sky-700 text-white shadow-sky-400" 
                           : "bg-sky-300 text-sky-500"
                       )}>
                          <s.icon size={18} strokeWidth={2.5} />
                       </div>
                       <span className={clsx(
                         "absolute -bottom-8 text-xs font-bold whitespace-nowrap transition-colors duration-300",
                         step >= s.num ? "text-sky-950" : "text-sky-400"
                       )}>{s.title}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Content Area */}
           <div className="p-6 md:p-12 bg-sky-100 min-h-[500px] flex flex-col justify-center">
             <div className="w-full max-w-2xl mx-auto">
                {step === 1 && <Step1 />}
                {step === 2 && <Step2 />}
                {step === 3 && <Step3 />}
                {step === 4 && <Step4 />}
                {step === 5 && <Step5 />}
             </div>
           </div>
        </div>

        {/* Footer */}
        {/*<footer className="mt-12 text-center text-slate-500 text-sm py-6">
           <p className="font-medium">I.S.E.T. N° 812 - CeRET Chubut</p>
           <p className="mt-1 flex justify-center items-center gap-4 text-xs">
              <span>Comodoro Rivadavia</span>
              <span>(0297) 444-1234</span>
              <span>contacto@iset812.edu.ar</span>
           </p>
        </footer>*/}
      </main>
    </div>
  );
}
