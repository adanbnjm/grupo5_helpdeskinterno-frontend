import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GestionTicket } from "../componentes/Tickets/GestionTicket";
import { useAuthStore } from "../store/useAuthStore";
import { ticketService } from "../services/ticketService";
import { obtenerMensajeError } from "../lib/errores";
import { BadgeEstado, BadgePrioridad } from "../componentes/Tickets/Badges";
import type { Ticket } from "../types/tickets";
import { useNotificacionesStore } from "../store/useNotificacionesStore";
import { HiloComentarios } from "../componentes/Comentarios/HiloComentarios";

const formatearFecha = (fecha: string | null) =>
  fecha
    ? new Date(fecha).toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";

const Dato = ({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: React.ReactNode;
}) => (
  <div>
    <dt className="text-xs font-medium text-slate-500 tracking-normal">
      {etiqueta}
    </dt>
    <dd className="mt-1 text-sm text-slate-800">{children}</dd>
  </div>
);

export const PaginaDetalleTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const rol = useAuthStore((state) => state.user?.rol?.toUpperCase());
  const puedeGestionar = rol === "ADMIN" || rol === "AGENTE";
  // Se incrementa después de guardar cambios para volver a pedir el ticket actualizado
  const [version, setVersion] = useState(0);
  const idNumero = Number(id);
  const idValido = Number.isInteger(idNumero) && idNumero > 0;

  // Guardamos a qué ID corresponde la respuesta, así "cargando" se deriva sin setState extra
  const [resultado, setResultado] = useState<{
    id: number;
    ticket?: Ticket;
    error?: string;
  } | null>(null);

  const revision = useNotificacionesStore((state) => state.revision);

  useEffect(() => {
    if (!idValido) return;
    let activo = true;
    ticketService
      .obtener(idNumero)
      .then((t) => activo && setResultado({ id: idNumero, ticket: t }))
      // 404 = no existe o es de otro empleado (el backend no distingue, a propósito)
      .catch(
        (err) =>
          activo &&
          setResultado({
            id: idNumero,
            error: obtenerMensajeError(err, "No se pudo cargar el ticket."),
          }),
      );
    return () => {
      activo = false;
    };
  }, [idNumero, idValido, revision, version]);

  const actual = resultado?.id === idNumero ? resultado : null;
  // Al recargar después de guardar, se sigue mostrando el ticket anterior hasta que llega el nuevo
  const cargando = idValido && !actual;
  const ticket = actual?.ticket ?? null;
  const error = !idValido
    ? "El ID del ticket no es válido."
    : (actual?.error ?? null);

  return (
    <div className="page-content">
      <div className="max-w-4xl mx-auto">
        <Link to="/tickets" className="text-sm text-blue-600 hover:underline">
          ← Volver al listado
        </Link>

        {cargando ? (
          <p className="mt-8 text-center text-slate-500">Cargando ticket...</p>
        ) : error || !ticket ? (
          <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <p className="text-red-600 font-medium">
              {error ?? "Ticket no encontrado."}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Puede que no exista o que no tengas permiso para verlo.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-2 mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Ticket #{ticket.id}</p>
                <h1 className="text-2xl font-bold text-slate-800">
                  {ticket.titulo}
                </h1>
              </div>
              <div className="flex gap-2">
                <BadgePrioridad prioridad={ticket.prioridad} />
                <BadgeEstado estado={ticket.estado} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-sm font-semibold text-slate-700 mb-2">
                  Descripción
                </h2>
                <p className="text-slate-700 whitespace-pre-line">
                  {ticket.descripcion}
                </p>
              </section>

              <aside className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <dl className="space-y-4">
                  <Dato etiqueta="Creado por">
                    {ticket.creador?.nombre ?? `Usuario #${ticket.creadorId}`}
                  </Dato>
                  <Dato etiqueta="Agente asignado">
                    {ticket.agente?.nombre ??
                      (ticket.agenteId ? (
                        `Agente #${ticket.agenteId}`
                      ) : (
                        <span className="text-slate-400">Sin asignar</span>
                      ))}
                  </Dato>
                  <Dato etiqueta="Categoría">
                    {ticket.categoria?.nombre ?? `#${ticket.categoriaId}`}
                  </Dato>
                  <Dato etiqueta="Creado">
                    {formatearFecha(ticket.creadoEn)}
                  </Dato>
                  <Dato etiqueta="Última actualización">
                    {formatearFecha(ticket.actualizadoEn)}
                  </Dato>
                  {ticket.cerradoEn && (
                    <Dato etiqueta="Cerrado">
                      {formatearFecha(ticket.cerradoEn)}
                    </Dato>
                  )}
                </dl>
              </aside>
            </div>

            {puedeGestionar && (
              <div className="mt-6 lg:w-1/3 lg:ml-auto">
                <GestionTicket
                  // key: al recargar el ticket, el formulario arranca con los valores nuevos
                  key={`${ticket.id}-${ticket.actualizadoEn}`}
                  ticket={ticket}
                  esAdmin={rol === "ADMIN"}
                  onActualizado={() => setVersion((v) => v + 1)}
                  onEliminado={() =>
                    navigate("/tickets", {
                      state: { mensaje: `Ticket #${ticket.id} eliminado.` },
                    })
                  }
                />
              </div>
            )}

            <div className="mt-6">
              <HiloComentarios key={ticket.id} ticketId={ticket.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
