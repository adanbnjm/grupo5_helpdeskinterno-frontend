export const CargandoPagina = () => {
  return (
    <div
      className="loading-state min-h-[60vh] flex flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
      <p className="text-sm font-medium text-slate-500">Cargando...</p>
    </div>
  );
};