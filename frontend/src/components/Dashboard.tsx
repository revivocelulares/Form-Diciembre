import { useEffect, useState } from 'react';
import { getInscripciones, getCarreras, getAnios } from '../api';
import { Search, Filter, RefreshCw, LayoutDashboard, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { utils, writeFile } from 'xlsx';

interface Inscripcion {
  id_inscripcion: number;
  fecha_inscripcion: string;
  cohorte: number;
  condicion: string;
  dni: string;
  apellido: string;
  nombre_alumno: string;
  email: string;
  carrera: string;
  anio_cursada: string;
  materia: string;
}

interface Carrera {
  id_carrera: number;
  nombre: string;
}

interface Anio {
  id_anio: number;
  nombre: string;
}

export const Dashboard = () => {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [listaCarreras, setListaCarreras] = useState<Carrera[]>([]);
  const [listaAnios, setListaAnios] = useState<Anio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtros
  const [search, setSearch] = useState('');
  const [filterCarrera, setFilterCarrera] = useState('');
  const [filterAnio, setFilterAnio] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [inscRes, carrerasRes, aniosRes] = await Promise.all([
        getInscripciones(),
        getCarreras(),
        getAnios()
      ]);
      
      setInscripciones(inscRes.data);
      setListaCarreras(carrerasRes.data);
      setListaAnios(aniosRes.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrado
  const filteredData = inscripciones.filter(item => {
    const matchesSearch = 
      item.apellido.toLowerCase().includes(search.toLowerCase()) ||
      item.nombre_alumno.toLowerCase().includes(search.toLowerCase()) ||
      item.dni.includes(search);
    
    const matchesCarrera = filterCarrera ? item.carrera === filterCarrera : true;
    const matchesAnio = filterAnio ? item.anio_cursada === filterAnio : true;

    return matchesSearch && matchesCarrera && matchesAnio;
  });

  // Exportar a Excel
  const handleExport = () => {
    const dataToExport = filteredData.map(item => ({
      Fecha: new Date(item.fecha_inscripcion).toLocaleDateString(),
      Apellido: item.apellido,
      Nombre: item.nombre_alumno,
      DNI: item.dni,
      Email: item.email,
      Carrera: item.carrera,
      'Año de Cursada': item.anio_cursada,
      Materia: item.materia,
      Condición: item.condicion,
      Cohorte: item.cohorte
    }));

    const ws = utils.json_to_sheet(dataToExport);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Inscripciones");
    
    const dateStr = new Date().toISOString().split('T')[0];
    writeFile(wb, `Inscripciones_${dateStr}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-sky-100 font-sans text-slate-700">
      {/* Header Admin */}
      <header className="bg-sky-800 py-4 px-6 md:px-12 flex justify-between items-center shadow-md border-b border-sky-900">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold backdrop-blur-sm">
             <LayoutDashboard size={20} />
          </div>
          <div>
             <h1 className="text-xl font-bold text-white tracking-tight">Panel Administrativo</h1>
             <p className="text-xs text-sky-200 font-medium">Gestión de Inscripciones</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={handleExport}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
                title="Exportar a Excel"
            >
                <Download size={16} />
                <span className="hidden md:inline">Exportar Excel</span>
            </button>
            <button 
                onClick={fetchData} 
                className="p-2 hover:bg-sky-700 rounded-full text-sky-200 transition-colors"
                title="Recargar datos"
            >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl py-8 px-4">
        
        {/* Stats Cards (Opcional - Visual) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-xs font-bold uppercase">Total Inscripciones</p>
                <p className="text-3xl font-bold text-sky-700 mt-2">{inscripciones.length}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-xs font-bold uppercase">Alumnos Únicos</p>
                <p className="text-3xl font-bold text-slate-700 mt-2">
                    {new Set(inscripciones.map(i => i.dni)).size}
                </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 text-xs font-bold uppercase">Carreras Activas</p>
                <p className="text-3xl font-bold text-slate-700 mt-2">{listaCarreras.length}</p>
            </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, apellido o DNI..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <div className="flex gap-4 w-full md:w-2/3">
                <div className="relative w-full">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <select 
                        className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm appearance-none cursor-pointer"
                        value={filterCarrera}
                        onChange={(e) => setFilterCarrera(e.target.value)}
                    >
                        <option value="">Todas las Carreras</option>
                        {listaCarreras.map(c => <option key={c.id_carrera} value={c.nombre}>{c.nombre}</option>)}
                    </select>
                </div>
                <div className="relative w-full">
                     <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     <select 
                        className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm appearance-none cursor-pointer"
                        value={filterAnio}
                        onChange={(e) => setFilterAnio(e.target.value)}
                    >
                        <option value="">Todos los Años</option>
                        {listaAnios.map(a => <option key={a.id_anio} value={a.nombre}>{a.nombre}</option>)}
                    </select>
                </div>
            </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg shadow-sky-100 overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Estudiante</th>
                            <th className="px-6 py-4">Carrera / Año</th>
                            <th className="px-6 py-4">Materia</th>
                            <th className="px-6 py-4 text-center">Condición</th>
                            <th className="px-6 py-4 text-center">Cohorte</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                             <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    Cargando datos...
                                </td>
                             </tr>
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    No se encontraron inscripciones.
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((insc) => (
                                <tr key={insc.id_inscripcion} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                        {new Date(insc.fecha_inscripcion).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-700">{insc.apellido}, {insc.nombre_alumno}</div>
                                        <div className="text-xs text-slate-400">DNI: {insc.dni}</div>
                                        <div className="text-xs text-sky-600">{insc.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-700">{insc.carrera}</div>
                                        <div className="text-xs text-slate-400">{insc.anio_cursada}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {insc.materia}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={clsx(
                                            "px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                            insc.condicion === 'regular' 
                                                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                : "bg-amber-100 text-amber-700 border border-amber-200"
                                        )}>
                                            {insc.condicion}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-slate-600 font-medium">
                                        {insc.cohorte}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Footer de la tabla */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
                 <span>Mostrando {filteredData.length} de {inscripciones.length} registros</span>
            </div>
        </div>

      </main>
    </div>
  );
};
