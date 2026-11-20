import { useEffect, useState } from "react";
import { perfilService, type Perfil } from "../services/perfilService";
import { obtenerMensajeError } from "../lib/errores";

type Resultado =
  | { intento: number; perfil: Perfil; error?: never }
  | { intento: number; error: string; perfil?: never };

export const PaginaPerfil = () => {
  const [intento, setIntento] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    let activo = true;

    perfilService
      .obtener()
      .then((perfil) => {
        if (activo) setResultado({ intento, perfil });
      })
      .catch((error: unknown) => {
        if (activo) {
          setResultado({
            intento,
            error: obtenerMensajeError(error, "No se pudo cargar tu perfil."),
          });
        }
      });

    return () => {
      activo = false;
    };
  }, [intento]);

  const actual = resultado?.intento === intento ? resultado : null;
  const cargando = actual === null;

  return (
    <section
      className="profile-panel mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-6"
      aria-busy={cargando}
    >
      <h1 className="text-2xl font-semibold">Mi perfil</h1>
      <p className="mt-1 text-sm text-slate-600">
        Datos de la cuenta con la que iniciaste sesión.
      </p>

      {cargando ? (
        <p role="status" className="mt-6 text-slate-600">
          Cargando perfil...
        </p>
      ) : actual.error !== undefined ? (
        <div className="mt-6">
          <p role="alert" className="text-red-700">
            {actual.error}
          </p>
          <button
            type="button"
            onClick={() => setIntento((valor) => valor + 1)}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <dl className="mt-6 divide-y divide-slate-200">
          {[
            ["Nombre", actual.perfil.nombre],
            ["Correo", actual.perfil.email],
            ["Rol", actual.perfil.rol],
          ].map(([etiqueta, valor]) => (
            <div key={etiqueta} className="py-4">
              <dt className="text-sm text-slate-500">{etiqueta}</dt>
              <dd className="mt-1 break-words font-medium">{valor}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};
