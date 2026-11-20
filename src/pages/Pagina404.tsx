import { Link } from "react-router-dom";

export const Pagina404 = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="empty-state w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold tracking-normalr text-red-600">
          Error 404
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-800">
          No existe esta página
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          La dirección que ingresaste no se encuentra disponible.
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};