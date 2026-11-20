import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuthStore } from "../../store/useAuthStore";
import { useNotificacionesStore } from "../../store/useNotificacionesStore";

interface EventoComentario {
  ticketId: number;
  titulo: string;
  autor: string;
}

interface EventoEstado {
  ticketId: number;
  titulo: string;
  estadoNuevo: string;
}

export const Notificaciones = () => {
  const token = useAuthStore((state) => state.token);
  const avisos = useNotificacionesStore((state) => state.avisos);
  const quitar = useNotificacionesStore((state) => state.quitar);
  const [problema, setProblema] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_WS_URL;

  const mensajeProblema = !baseUrl
    ? "No está configurada la conexión de notificaciones."
    : problema;

  useEffect(() => {
    if (!token || !baseUrl) return;

    const socket = io(`${baseUrl.replace(/\/+$/, "")}/notificaciones`, {
      auth: { token },
    });

    let secuencia = 0;
    const temporizadores = new Set<ReturnType<typeof setTimeout>>();

    const avisar = (ticketId: number, mensaje: string) => {
      const id = ++secuencia;

      useNotificacionesStore.getState().agregar({
        id,
        ticketId,
        mensaje,
      });

      const temporizador = setTimeout(() => {
        useNotificacionesStore.getState().quitar(id);
        temporizadores.delete(temporizador);
      }, 10000);

      temporizadores.add(temporizador);
    };

    socket.on("conectado", () => {
      setProblema(null);
      useNotificacionesStore.getState().actualizar();
    });

    socket.on("connect_error", () => {
      setProblema(
        "No se pudo conectar con los avisos en vivo. Reintentando...",
      );
    });

    socket.on("disconnect", (motivo) => {
      setProblema(
        motivo === "io server disconnect"
          ? "La conexión de avisos fue cerrada. Inicia sesión nuevamente."
          : "Avisos en vivo desconectados. Reintentando...",
      );
    });

    socket.on("error", () => {
      setProblema("No se pudo autorizar la conexión de avisos.");
    });

    socket.on("ticket.nuevo_comentario", (evento: EventoComentario) => {
      avisar(
        evento.ticketId,
        `${evento.autor} comentó en el ticket #${evento.ticketId}: ${evento.titulo}`,
      );
    });

    socket.on("ticket.estado_cambiado", (evento: EventoEstado) => {
      avisar(
        evento.ticketId,
        `El ticket #${evento.ticketId} cambió a ${evento.estadoNuevo.replaceAll("_", " ")}.`,
      );
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      temporizadores.forEach(clearTimeout);
      useNotificacionesStore.getState().limpiar();
    };
  }, [token, baseUrl]);

  return (
    <>
      {mensajeProblema && (
        <p
          role="status"
          className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800"
        >
          {mensajeProblema}
        </p>
      )}

      <div
        aria-live="polite"
        aria-relevant="additions"
        className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] space-y-3"
      >
        {avisos.map((aviso) => (
          <div
            key={aviso.id}
            className="rounded-xl border border-blue-200 bg-white p-4 shadow-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-slate-800">{aviso.mensaje}</p>
              <button
                type="button"
                aria-label="Cerrar aviso"
                onClick={() => quitar(aviso.id)}
                className="rounded px-2 text-slate-600 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <Link
              to={`/tickets/${aviso.ticketId}`}
              onClick={() => quitar(aviso.id)}
              className="mt-3 inline-block text-sm font-medium text-blue-700 hover:underline"
            >
              Ver ticket
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};
