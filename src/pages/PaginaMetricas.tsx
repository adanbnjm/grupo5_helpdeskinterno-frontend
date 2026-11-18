import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  metricasService,
  type MetricasTickets,
} from "../services/metricasService";

export const PaginaMetricas = () => {
  const [metricas, setMetricas] = useState<MetricasTickets | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      setCargando(true);
      setError(null);

      try {
        const datos = await metricasService.obtener();

        if (activo) {
          setMetricas(datos);
        }
      } catch (error) {
        if (!activo) return;

        let mensaje = "No se pudieron cargar las métricas. Intenta nuevamente.";

        if (isAxiosError(error)) {
          if (error.response?.status === 401) {
            mensaje =
              "Tu sesión no es válida. Cierra sesión e ingresa nuevamente.";
          } else if (error.response?.status === 403) {
            mensaje = "No tienes permiso para consultar las métricas.";
          } else if (!error.response) {
            mensaje = "No se pudo conectar con el servidor.";
          }
        }

        setError(mensaje);
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    void cargar();

    return () => {
      activo = false;
    };
  }, [intento]);

  const porEstado = metricas
    ? [
        { nombre: "Abiertos", total: metricas.porEstado.ABIERTO },
        { nombre: "En proceso", total: metricas.porEstado.EN_PROCESO },
        { nombre: "Resueltos", total: metricas.porEstado.RESUELTO },
        { nombre: "Cerrados", total: metricas.porEstado.CERRADO },
      ]
    : [];

  const pendientes = metricas
    ? metricas.porEstado.ABIERTO + metricas.porEstado.EN_PROCESO
    : 0;

  return (
    <section className="mx-auto max-w-6xl" aria-busy={cargando}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Métricas de tickets</h1>
          <p className="mt-1 text-sm text-slate-600">
            Distribución del trabajo del equipo de soporte.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIntento((valor) => valor + 1)}
          disabled={cargando}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cargando ? "Cargando..." : error ? "Reintentar" : "Actualizar"}
        </button>
      </div>

      {cargando ? (
        <p role="status" className="rounded-xl bg-white p-6 text-slate-600">
          Cargando métricas...
        </p>
      ) : error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700"
        >
          {error}
        </p>
      ) : metricas ? (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-medium text-slate-600">
                Total de tickets
              </h2>
              <p className="mt-2 text-4xl font-semibold">{metricas.total}</p>
              <p className="mt-2 text-sm text-slate-500">
                Tickets de todos los estados.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-sm font-medium text-slate-600">Pendientes</h2>
              <p className="mt-2 text-4xl font-semibold text-blue-700">
                {pendientes}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Abiertos y en proceso.
              </p>
            </article>
          </div>

          {metricas.total === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
              Todavía no hay tickets para mostrar en los gráficos.
            </p>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                <h2 className="mb-4 text-lg font-semibold">Por estado</h2>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={porEstado}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                      accessibilityLayer
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="nombre"
                        tick={{ fontSize: 11 }}
                        interval={0}
                      />
                      <YAxis allowDecimals={false} width={35} />
                      <Tooltip />
                      <Bar
                        dataKey="total"
                        name="Tickets"
                        fill="#2563eb"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <ul className="mt-4 space-y-2 text-sm">
                  {porEstado.map((estado) => (
                    <li
                      key={estado.nombre}
                      className="flex justify-between gap-4"
                    >
                      <span className="text-slate-600">{estado.nombre}</span>
                      <span className="font-medium">{estado.total}</span>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
                <h2 className="mb-4 text-lg font-semibold">Por categoría</h2>

                {metricas.porCategoria.length === 0 ? (
                  <p className="text-sm text-slate-600">
                    No hay categorías disponibles.
                  </p>
                ) : (
                  <>
                    <div
                      style={{
                        height: Math.max(
                          288,
                          metricas.porCategoria.length * 48,
                        ),
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={metricas.porCategoria}
                          layout="vertical"
                          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                          accessibilityLayer
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={false}
                          />
                          <XAxis type="number" allowDecimals={false} />
                          <YAxis
                            type="category"
                            dataKey="nombre"
                            width={90}
                            tick={{ fontSize: 11 }}
                            tickFormatter={(nombre: string) =>
                              nombre.length > 13
                                ? `${nombre.slice(0, 12)}…`
                                : nombre
                            }
                          />
                          <Tooltip />
                          <Bar
                            dataKey="total"
                            name="Tickets"
                            fill="#0f766e"
                            radius={[0, 4, 4, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <ul className="mt-4 space-y-2 text-sm">
                      {metricas.porCategoria.map((categoria) => (
                        <li
                          key={categoria.id}
                          className="flex justify-between gap-4"
                        >
                          <span className="break-words text-slate-600">
                            {categoria.nombre}
                          </span>
                          <span className="font-medium">{categoria.total}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </article>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
};
