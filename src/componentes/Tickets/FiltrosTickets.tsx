import { useEffect, useState } from 'react';
import { ticketService } from '../../services/ticketService';
import type { FiltrosTickets as Filtros, UsuarioResumen } from '../../types/tickets';

interface Props {
  filtros: Filtros;
  categorias: Record<number, string>;
  mostrarAgente: boolean; // el EMPLEADO no puede listar agentes
  onCambiar: (filtros: Filtros) => void;
}

const claseCampo =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-2 focus:outline-blue-600';

const Campo = ({ etiqueta, id, children }: { etiqueta: string; id: string; children: React.ReactNode }) => (
  <div>
    <label htmlFor={id} className="block text-xs font-medium text-slate-500 mb-1">
      {etiqueta}
    </label>
    {children}
  </div>
);

// Filtros del listado: se aplican en el backend, así funcionan sobre TODOS los tickets y no solo la página actual
export const FiltrosTickets = ({ filtros, categorias, mostrarAgente, onCambiar }: Props) => {
  const [agentes, setAgentes] = useState<UsuarioResumen[]>([]);

  useEffect(() => {
    if (!mostrarAgente) return;
    ticketService.listarAgentes().then(setAgentes).catch(() => setAgentes([]));
  }, [mostrarAgente]);

  const cambiar = (campo: keyof Filtros, valor: string) => onCambiar({ ...filtros, [campo]: valor });
  const hayFiltros = Object.values(filtros).some((v) => v);

  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-slate-700">Filtros</h2>
        <button
          type="button"
          onClick={() => onCambiar({})}
          disabled={!hayFiltros}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs hover:bg-slate-50 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Campo etiqueta="Estado" id="filtro-estado">
          <select
            id="filtro-estado"
            value={filtros.estado ?? ''}
            onChange={(e) => cambiar('estado', e.target.value)}
            className={claseCampo}
          >
            <option value="">Todos</option>
            <option value="ABIERTO">Abierto</option>
            <option value="EN_PROCESO">En proceso</option>
            <option value="RESUELTO">Resuelto</option>
            <option value="CERRADO">Cerrado</option>
          </select>
        </Campo>

        <Campo etiqueta="Prioridad" id="filtro-prioridad">
          <select
            id="filtro-prioridad"
            value={filtros.prioridad ?? ''}
            onChange={(e) => cambiar('prioridad', e.target.value)}
            className={claseCampo}
          >
            <option value="">Todas</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>
        </Campo>

        <Campo etiqueta="Categoría" id="filtro-categoria">
          <select
            id="filtro-categoria"
            value={filtros.categoriaId ?? ''}
            onChange={(e) => cambiar('categoriaId', e.target.value)}
            className={claseCampo}
          >
            <option value="">Todas</option>
            {Object.entries(categorias).map(([id, nombre]) => (
              <option key={id} value={id}>
                {nombre}
              </option>
            ))}
          </select>
        </Campo>

        {mostrarAgente && (
          <Campo etiqueta="Agente" id="filtro-agente">
            <select
              id="filtro-agente"
              value={filtros.agenteId ?? ''}
              onChange={(e) => cambiar('agenteId', e.target.value)}
              className={claseCampo}
            >
              <option value="">Todos</option>
              <option value="0">Sin asignar</option>
              {agentes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </Campo>
        )}

        <Campo etiqueta="Desde" id="filtro-desde">
          <input
            id="filtro-desde"
            type="date"
            value={filtros.desde ?? ''}
            max={filtros.hasta || undefined}
            onChange={(e) => cambiar('desde', e.target.value)}
            className={claseCampo}
          />
        </Campo>

        <Campo etiqueta="Hasta" id="filtro-hasta">
          <input
            id="filtro-hasta"
            type="date"
            value={filtros.hasta ?? ''}
            min={filtros.desde || undefined}
            onChange={(e) => cambiar('hasta', e.target.value)}
            className={claseCampo}
          />
        </Campo>
      </div>
    </div>
  );
};
