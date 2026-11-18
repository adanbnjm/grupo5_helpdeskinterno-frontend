import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const PaginaDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">HelpDesk Panel</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600 hidden sm:inline">
            Hola, <span className="font-semibold text-slate-800">{user?.nombre || 'Usuario'}</span>
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg border border-red-200 transition cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            ¡Hola, {user?.nombre || 'Usuario'}!
          </h1>
          <p className="text-slate-500 text-sm">
            Rol en el sistema: <span className="font-semibold text-slate-700">{user?.rol || 'EMPLEADO'}</span>
          </p>
        </div>
      </main>
    </div>
  );
};