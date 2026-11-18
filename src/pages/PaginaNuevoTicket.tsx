import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ticketService } from '../services/ticketService';
import { useAuthStore } from '../store/useAuthStore';
import { obtenerMensajeError } from '../lib/errores';
import type { Categoria, CrearTicketDto, Prioridad, UsuarioResumen } from '../types/tickets';

interface ErroresFormulario {
  titulo?: string;
  descripcion?: string;
  categoriaId?: string;
  prioridad?: string;
}

const claseCampo =
  'w-full px-4 py-2.5 rounded-lg border text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition';

export const PaginaNuevoTicket = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const esAdmin = user?.rol === 'ADMIN';

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [prioridad, setPrioridad] = useState<Prioridad | ''>('');
  const [agenteId, setAgenteId] = useState('');

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [agentes, setAgentes] = useState<UsuarioResumen[]>([]);
  const [errores, setErrores] = useState<ErroresFormulario>({});
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    ticketService
      .listarCategorias()
      .then((lista) => setCategorias(lista.filter((c) => c.activa)))
      .catch(() => setErrorServidor('No se pudieron cargar las categorías.'));

    // Solo el ADMIN puede asignar, así que solo él necesita la lista de agentes
    if (esAdmin) {
      ticketService
        .listarAgentes()
        .then(setAgentes)
        .catch(() => setAgentes([]));
    }
  }, [esAdmin]);

  // Mismas reglas que valida el backend (CreateTicketDto)
  const validar = (): ErroresFormulario => {
    const e: ErroresFormulario = {};
    if (titulo.trim().length < 3) e.titulo = 'El título debe tener al menos 3 caracteres.';
    if (descripcion.trim().length < 2) e.descripcion = 'La descripción debe tener al menos 2 caracteres.';
    if (!categoriaId) e.categoriaId = 'Elegí una categoría.';
    if (!prioridad) e.prioridad = 'Elegí una prioridad.';
    return e;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorServidor(null);

    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    const dto: CrearTicketDto = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      categoriaId: Number(categoriaId),
      prioridad: prioridad as Prioridad,
    };
    if (esAdmin && agenteId) dto.agenteId = Number(agenteId);

    setEnviando(true);
    try {
      const creado = await ticketService.crear(dto);
      // El listado lee este mensaje y lo muestra como aviso de éxito
      navigate('/tickets', { state: { mensaje: `Ticket #${creado.id} creado correctamente.` } });
    } catch (err) {
      setErrorServidor(obtenerMensajeError(err, 'No se pudo crear el ticket.'));
      setEnviando(false);
    }
  };

  const bordeCampo = (campo: keyof ErroresFormulario) =>
    errores[campo] ? 'border-red-400' : 'border-slate-300';

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/tickets" className="text-sm text-blue-600 hover:underline">
          ← Volver al listado
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mt-2 mb-6">Reportar una incidencia</h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-5"
        >
          {errorServidor && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {errorServidor}
            </div>
          )}

          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-slate-700 mb-1">
              Título
            </label>
            <input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: La impresora no imprime"
              className={`${claseCampo} ${bordeCampo('titulo')}`}
            />
            {errores.titulo && <p className="text-xs text-red-600 mt-1">{errores.titulo}</p>}
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              rows={4}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Contá qué pasa, desde cuándo y qué intentaste"
              className={`${claseCampo} ${bordeCampo('descripcion')} resize-y`}
            />
            {errores.descripcion && <p className="text-xs text-red-600 mt-1">{errores.descripcion}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-slate-700 mb-1">
                Categoría
              </label>
              <select
                id="categoria"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className={`${claseCampo} ${bordeCampo('categoriaId')} bg-white`}
              >
                <option value="">Seleccionar...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              {errores.categoriaId && <p className="text-xs text-red-600 mt-1">{errores.categoriaId}</p>}
            </div>

            <div>
              <label htmlFor="prioridad" className="block text-sm font-medium text-slate-700 mb-1">
                Prioridad
              </label>
              <select
                id="prioridad"
                value={prioridad}
                onChange={(e) => setPrioridad(e.target.value as Prioridad | '')}
                className={`${claseCampo} ${bordeCampo('prioridad')} bg-white`}
              >
                <option value="">Seleccionar...</option>
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
              {errores.prioridad && <p className="text-xs text-red-600 mt-1">{errores.prioridad}</p>}
            </div>
          </div>

          {esAdmin && (
            <div>
              <label htmlFor="agente" className="block text-sm font-medium text-slate-700 mb-1">
                Asignar a un agente <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <select
                id="agente"
                value={agenteId}
                onChange={(e) => setAgenteId(e.target.value)}
                className={`${claseCampo} border-slate-300 bg-white`}
              >
                <option value="">Sin asignar</option>
                {agentes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Link
              to="/tickets"
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={enviando}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-sm transition cursor-pointer disabled:cursor-not-allowed"
            >
              {enviando ? 'Creando...' : 'Crear ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};