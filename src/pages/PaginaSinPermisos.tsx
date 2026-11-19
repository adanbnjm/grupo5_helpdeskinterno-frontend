import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const PaginaSinPermisos = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
          !
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          No tienes permisos para acceder
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          Tu rol actual{' '}
          <span className="font-semibold text-slate-800">
            {user?.rol || 'SIN ROL'}
          </span>{' '}
          no tiene autorización para ver esta sección. Tu sesión sigue activa.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
};