import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";
import {
  comentariosService,
  type Comentario,
} from "../../services/comentariosService";
import { useAuthStore } from "../../store/useAuthStore";
import { useNotificacionesStore } from "../../store/useNotificacionesStore";

interface Props {
  ticketId: number;
}

const mensajeError = (error: unknown): string => {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) {
      return "Tu sesión no es válida. Inicia sesión nuevamente.";
    }

    if ([403, 404].includes(error.response?.status ?? 0)) {
      return "El ticket no está disponible o no tienes permiso para acceder.";
    }
  }

  return "No se pudo completar la operación. Comprueba la conexión e intenta nuevamente.";
};

export const HiloComentarios = ({ ticketId }: Props) => {
  const user = useAuthStore((state) => state.user);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [contenido, setContenido] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");
  const [intento, setIntento] = useState(0);
  const envioEnCurso = useRef(false);
  const revision = useNotificacionesStore((state) => state.revision);
  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      setCargando(true);
      setErrorCarga(null);

      try {
        const datos = await comentariosService.listar(ticketId);
        if (activo) setComentarios(datos);
      } catch (error) {
        if (activo) setErrorCarga(mensajeError(error));
      } finally {
        if (activo) setCargando(false);
      }
    };

    void cargar();

    return () => {
      activo = false;
    };
  }, [ticketId, intento, revision]);

  const publicar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (envioEnCurso.current) return;

    const texto = contenido.trim();
    setErrorEnvio(null);
    setAviso("");

    if (!texto) {
      setErrorEnvio("Escribe un comentario; no puede contener solo espacios.");
      return;
    }

    if (texto.length > 2000) {
      setErrorEnvio("El comentario no puede superar los 2000 caracteres.");
      return;
    }

    envioEnCurso.current = true;
    setEnviando(true);

    try {
      const nuevo = await comentariosService.publicar(ticketId, texto);

      setComentarios((actuales) =>
        [...actuales.filter((item) => item.id !== nuevo.id), nuevo].sort(
          (a, b) =>
            Date.parse(a.creadoEn) - Date.parse(b.creadoEn) || a.id - b.id,
        ),
      );
      setContenido("");
      setAviso("Comentario publicado.");
    } catch (error) {
      setErrorEnvio(mensajeError(error));
    } finally {
      envioEnCurso.current = false;
      setEnviando(false);
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Conversación</h2>
        <button
          type="button"
          disabled={cargando || enviando}
          onClick={() => setIntento((valor) => valor + 1)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          {errorCarga ? "Reintentar" : "Actualizar"}
        </button>
      </div>

      {cargando ? (
        <p role="status" className="text-slate-600">
          Cargando comentarios...
        </p>
      ) : errorCarga ? (
        <p role="alert" className="text-red-700">
          {errorCarga}
        </p>
      ) : (
        <>
          {comentarios.length === 0 ? (
            <p className="text-sm text-slate-500">
              Todavía no hay comentarios. Puedes iniciar la conversación.
            </p>
          ) : (
            <ol className="space-y-4">
              {comentarios.map((comentario) => {
                const esPropio =
                  String(comentario.autor.id) === String(user?.id);

                return (
                  <li key={comentario.id}>
                    <article
                      className={`rounded-lg border p-4 ${
                        esPropio
                          ? "border-blue-200 bg-blue-50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">
                            {comentario.autor.nombre}
                            {esPropio ? " (tú)" : ""}
                          </p>
                          <p className="text-xs text-slate-500">
                            {comentario.autor.rol}
                          </p>
                        </div>

                        <time
                          dateTime={comentario.creadoEn}
                          className="text-xs text-slate-500"
                        >
                          {new Date(comentario.creadoEn).toLocaleString("es", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </time>
                      </div>

                      <p className="mt-3 whitespace-pre-wrap break-words text-sm text-slate-800">
                        {comentario.contenido}
                      </p>
                    </article>
                  </li>
                );
              })}
            </ol>
          )}

          <form
            onSubmit={publicar}
            className="mt-6 border-t border-slate-200 pt-6"
          >
            <label htmlFor="comentario" className="block text-sm font-medium">
              Escribe una respuesta
            </label>

            <textarea
              id="comentario"
              value={contenido}
              onChange={(evento) => {
                setContenido(evento.target.value);
                setErrorEnvio(null);
                setAviso("");
              }}
              maxLength={2000}
              required
              disabled={enviando}
              rows={4}
              aria-invalid={Boolean(errorEnvio)}
              aria-describedby={
                errorEnvio
                  ? "contador-comentario error-comentario"
                  : "contador-comentario"
              }
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-blue-600 focus:outline-2 focus:outline-blue-600 disabled:opacity-60"
            />

            <p
              id="contador-comentario"
              className="mt-1 text-right text-xs text-slate-500"
            >
              {contenido.length}/2000
            </p>

            {errorEnvio && (
              <p
                id="error-comentario"
                role="alert"
                className="mt-2 text-sm text-red-700"
              >
                {errorEnvio}
              </p>
            )}

            <p role="status" className="mt-2 text-sm text-green-700">
              {aviso}
            </p>

            <button
              type="submit"
              disabled={enviando || !contenido.trim()}
              className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {enviando ? "Publicando..." : "Publicar comentario"}
            </button>
          </form>
        </>
      )}
    </section>
  );
};
