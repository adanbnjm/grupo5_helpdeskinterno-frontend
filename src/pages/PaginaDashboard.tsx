import { useAuthStore } from "../store/useAuthStore";

export const PaginaDashboard = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">
        Hola, {user?.nombre || "bienvenido"}
      </h1>
      <p className="mt-2 text-slate-600">
        Selecciona una opción del menú para continuar.
      </p>
    </section>
  );
};
