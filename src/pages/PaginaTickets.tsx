import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { useAuthStore } from '../store/useAuthStore';
import { obtenerMensajeError } from '../lib/errores';
import { BadgeEstado, BadgePrioridad } from '../componentes/Tickets/Badges';
import type { MetaPaginacion, Ticket } from '../types/tickets';

const LIMITE = 10;

export const PaginaTickets = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  // Mensaje de éxito que manda PaginaNuevoTicket al redirigir
  const [aviso, setAviso] = useState<string | null>(
    (location.state as { mensaje?: string } | null)?.mensaje ?? null,
  );

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [meta, setMeta] = useState<MetaPaginacion | null>(null);
  const [categorias, setCategorias] = useState<Record<number, string>>({});
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Las categorías se cargan una sola vez para mostrar el nombre en vez del ID
  useEffect(() => {
    ticketService
      .listarCategorias()
      .then((lista) => setCategorias(Object.fromEntries(lista.map((c) => [c.id, c.nombre]))))
      .catch(() => setCategorias({}));
  }, []);

  // Los tickets se recargan cada vez que cambia la página
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError(null);
      try {
        const respuesta = await ticketService.listar(pagina, LIMITE);
        setTickets(respuesta.data);
        setMeta(respuesta.meta);
      } catch (err) {
        setError(obtenerMensajeError(err, 'No se pudieron cargar los tickets.'));
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [pagina]);

  // El aviso se borra solo a los 4 segundos y se limpia el state para que no reaparezca al recargar
  useEffect(() => {
    if (!aviso) return;
    navigate(location.pathname, { replace: true, state: null });
    const t = setTimeout(() => setAviso(null), 4000);
    return () => clearTimeout(t);
  }, [aviso, navigate, location.pathname]);

  const esEmpleado = user?.rol === 'EMPLEADO';
  const totalPaginas = meta?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {esEmpleado ? 'Mis tickets' : 'Todos los tickets'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {meta ? `${meta.total} ticket${meta.total === 1 ? '' : 's'} en total` : '\u00a0'}
            </p>
          </div>
          <Link
            to="/tickets/nuevo"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            + Nuevo ticket
          </Link>
        </div>

        {aviso && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {aviso}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {cargando ? (
            <p className="p-8 text-center text-slate-500">Cargando tickets...</p>
          ) : error ? (
            <p className="p-8 text-center text-red-600">{error}</p>
          ) : tickets.length === 0 ? (
            <p className="p-8 text-center text-slate-500">No hay tickets para mostrar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Título</th>
                    <th className="px-4 py-3 font-semibold">Categoría</th>
                    <th className="px-4 py-3 font-semibold">Prioridad</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Agente</th>
                    <th className="px-4 py-3 font-semibold">Creado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => navigate(`/tickets/${t.id}`)}
                      className="hover:bg-slate-50 transition cursor-pointer"
                    >
                      <td className="px-4 py-3 text-slate-500">{t.id}</td>
                      <td className="px-4 py-3 font-medium text-slate-800">{t.titulo}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {t.categoria?.nombre ?? categorias[t.categoriaId] ?? `#${t.categoriaId}`}
                      </td>
                      <td className="px-4 py-3">
                        <BadgePrioridad prioridad={t.prioridad} />
                      </td>
                      <td className="px-4 py-3">
                        <BadgeEstado estado={t.estado} />
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {t.agente?.nombre ??
                          (t.agenteId ? `Agente #${t.agenteId}` : <span className="text-slate-400">Sin asignar</span>)}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(t.creadoEn).toLocaleDateString('es-AR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {meta && totalPaginas > 1 && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPagina((p) => p - 1)}
              disabled={pagina <= 1 || cargando}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              ← Anterior
            </button>
            <span className="text-sm text-slate-600">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina((p) => p + 1)}
              disabled={pagina >= totalPaginas || cargando}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};