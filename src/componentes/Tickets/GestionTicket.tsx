import { useEffect, useState } from 'react';
import { ticketService } from '../../services/ticketService';
import { obtenerMensajeError } from '../../lib/errores';
import type {
  ActualizarTicketDto,
  Categoria,
  EstadoTicket,
  Prioridad,
  Ticket,
  UsuarioResumen,
} from '../../types/tickets';

interface Props {
  ticket: Ticket;
  esAdmin: boolean;
  onActualizado: () => void;
  onEliminado: () => void;
}

const ESTADOS: { valor: EstadoTicket; texto: string }[] = [
  { valor: 'ABIERTO', texto: 'Abierto' },
  { valor: 'EN_PROCESO', texto: 'En proceso' },
  { valor: 'RESUELTO', texto: 'Resuelto' },
  { valor: 'CERRADO', texto: 'Cerrado' },
];

const claseSelect =
  'w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100 disabled:text-slate-400';

// US-17 (cambiar estado) y US-18 (reasignar agente, editar prioridad/categoría y eliminar)
export const GestionTicket = ({ ticket, esAdmin, onActualizado, onEliminado }: Props) => {
  const [estado, setEstado] = useState<EstadoTicket>(ticket.estado);
  const [prioridad, setPrioridad] = useState<Prioridad>(ticket.prioridad);
  const [categoriaId, setCategoriaId] = useState(String(ticket.categoriaId));
  const [agenteId, setAgenteId] = useState(ticket.agenteId ? String(ticket.agenteId) : '');

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [agentes, setAgentes] = useState<UsuarioResumen[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cerrado = ticket.estado === 'CERRADO';

  // Las listas solo las necesita el ADMIN, que es el único que puede editar esos campos
  useEffect(() => {
    if (!esAdmin) return;
    ticketService.listarCategorias().then(setCategorias).catch(() => setCategorias([]));
    ticketService.listarAgentes().then(setAgentes).catch(() => setAgentes([]));
  }, [esAdmin]);

  // Arma el PATCH solo con lo que cambió
  const cambios: ActualizarTicketDto = {};
  if (estado !== ticket.estado) cambios.estado = estado;
  if (esAdmin) {
    if (prioridad !== ticket.prioridad) cambios.prioridad = prioridad;
    if (Number(categoriaId) !== ticket.categoriaId) cambios.categoriaId = Number(categoriaId);
    if (agenteId && Number(agenteId) !== ticket.agenteId) cambios.agenteId = Number(agenteId);
  }
  const hayCambios = Object.keys(cambios).length > 0;

  const guardar = async () => {
    if (!hayCambios) return;
    if (
      cambios.estado === 'CERRADO' &&
      !window.confirm('Una vez cerrado, el ticket no se puede volver a abrir. ¿Cerrarlo igual?')
    ) {
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      await ticketService.actualizar(ticket.id, cambios);
      onActualizado();
    } catch (err) {
      setError(obtenerMensajeError(err, 'No se pudieron guardar los cambios.'));
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async () => {
    if (!window.confirm(`¿Eliminar el ticket #${ticket.id}? También se borran sus comentarios.`)) return;
    setGuardando(true);
    setError(null);
    try {
      await ticketService.eliminar(ticket.id);
      onEliminado();
    } catch (err) {
      setError(obtenerMensajeError(err, 'No se pudo eliminar el ticket.'));
      setGuardando(false);
    }
  };

  return (
    <section className="ticket-management bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
      <h2 className="text-sm font-semibold text-slate-700">Gestión del ticket</h2>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      <div>
        <label htmlFor="estado" className="block text-xs font-medium text-slate-500 mb-1">
          Estado
        </label>
        <select
          id="estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoTicket)}
          disabled={cerrado || guardando}
          className={claseSelect}
        >
          {ESTADOS.map((e) => (
            <option key={e.valor} value={e.valor}>
              {e.texto}
            </option>
          ))}
        </select>
        {cerrado && (
          <p className="text-xs text-slate-500 mt-1">Este ticket está cerrado y no se puede reabrir.</p>
        )}
      </div>

      {esAdmin && (
        <>
          <div>
            <label htmlFor="agente" className="block text-xs font-medium text-slate-500 mb-1">
              Agente asignado
            </label>
            <select
              id="agente"
              value={agenteId}
              onChange={(e) => setAgenteId(e.target.value)}
              disabled={guardando}
              className={claseSelect}
            >
              {!ticket.agenteId && <option value="">Sin asignar</option>}
              {agentes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="prioridad" className="block text-xs font-medium text-slate-500 mb-1">
                Prioridad
              </label>
              <select
                id="prioridad"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as Prioridad)}
                disabled={guardando}
                className={claseSelect}
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>
            <div>
              <label htmlFor="categoria" className="block text-xs font-medium text-slate-500 mb-1">
                Categoría
              </label>
              <select
                id="categoria"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                disabled={guardando}
                className={claseSelect}
              >
                {/* Si la categoría actual está inactiva, igual se muestra para no perderla */}
                {!categorias.some((c) => c.id === ticket.categoriaId) && (
                  <option value={ticket.categoriaId}>
                    {ticket.categoria?.nombre ?? `#${ticket.categoriaId}`}
                  </option>
                )}
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}

      <button
        onClick={guardar}
        disabled={!hayCambios || guardando}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg transition cursor-pointer disabled:cursor-not-allowed"
      >
        {guardando ? 'Guardando...' : 'Guardar cambios'}
      </button>

      {esAdmin && (
        <button
          onClick={eliminar}
          disabled={guardando}
          className="w-full py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg transition cursor-pointer disabled:opacity-50"
        >
          Eliminar ticket
        </button>
      )}
    </section>
  );
};
