import { Link, useParams } from "react-router-dom";
import { HiloComentarios } from "../componentes/Comentarios/HiloComentarios";

export const PaginaComentarios = () => {
  const { id } = useParams();
  const ticketId = Number(id);
  const idValido =
    /^\d+$/.test(id ?? "") && Number.isSafeInteger(ticketId) && ticketId > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/tickets"
        className="text-sm font-medium text-blue-700 hover:underline"
      >
        Volver a tickets
      </Link>

      <h1 className="mb-6 mt-4 text-2xl font-semibold">
        Comentarios del ticket {idValido ? `#${ticketId}` : ""}
      </h1>

      {idValido ? (
        <HiloComentarios key={ticketId} ticketId={ticketId} />
      ) : (
        <p role="alert" className="text-red-700">
          El identificador del ticket no es válido.
        </p>
      )}
    </div>
  );
};
