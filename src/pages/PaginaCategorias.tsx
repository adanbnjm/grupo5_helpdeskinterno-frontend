import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { categoriaService } from "../services/categoriaService";
import type { Categoria } from "../types/tickets";

export const PaginaCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(
    null,
  );

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const obtenerMensajeError = (err: unknown, mensajePredeterminado: string) => {
    const errorAxios = err as AxiosError<{ message?: string | string[] }>;
    const mensaje = errorAxios.response?.data?.message;

    return Array.isArray(mensaje)
      ? mensaje[0]
      : mensaje || mensajePredeterminado;
  };

  const cargarCategorias = async () => {
    setCargando(true);
    setError(null);

    try {
      const respuesta = await categoriaService.listar();
      setCategorias(respuesta);
    } catch (err) {
      setError(
        obtenerMensajeError(err, "No se pudieron cargar las categorías."),
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const limpiarFormulario = () => {
    setNombre("");
    setDescripcion("");
    setCategoriaEditando(null);
    setMostrarFormulario(false);
  };

  const prepararEdicion = (categoria: Categoria) => {
    setCategoriaEditando(categoria);
    setNombre(categoria.nombre);
    setDescripcion(categoria.descripcion ?? "");
    setMostrarFormulario(true);
    setError(null);
  };

  const guardarCategoria = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      if (categoriaEditando) {
        await categoriaService.actualizar(categoriaEditando.id, {
          nombre,
          descripcion,
        });
      } else {
        await categoriaService.crear({
          nombre,
          descripcion,
        });
      }

      limpiarFormulario();
      await cargarCategorias();
    } catch (err) {
      setError(
        obtenerMensajeError(
          err,
          categoriaEditando
            ? "No se pudo actualizar la categoría."
            : "No se pudo crear la categoría.",
        ),
      );
    }
  };

  const eliminarCategoria = async (categoria: Categoria) => {
    const confirmado = window.confirm(
      `¿Estás seguro de que deseas eliminar la categoría "${categoria.nombre}"?`,
    );

    if (!confirmado) return;

    setError(null);

    try {
      await categoriaService.eliminar(categoria.id);
      await cargarCategorias();
    } catch (err) {
      setError(obtenerMensajeError(err, "No se pudo eliminar la categoría."));
    }
  };

  return (
    <div className="page-content">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Administración de categorías
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {categorias.length} categorías registradas
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (mostrarFormulario) {
                limpiarFormulario();
              } else {
                setError(null);
                setCategoriaEditando(null);
                setNombre("");
                setDescripcion("");
                setMostrarFormulario(true);
              }
            }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
          >
            {mostrarFormulario ? "Cancelar" : "+ Crear categoría"}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {mostrarFormulario && (
          <form
            onSubmit={guardarCategoria}
            className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-4 text-lg font-bold text-slate-800">
              {categoriaEditando ? "Editar categoría" : "Nueva categoría"}
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="nombreCategoria"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Nombre
                </label>

                <input
                  id="nombreCategoria"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  maxLength={100}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej. Soporte técnico"
                />
              </div>

              <div>
                <label
                  htmlFor="descripcionCategoria"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Descripción
                </label>

                <textarea
                  id="descripcionCategoria"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  maxLength={255}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe brevemente la categoría"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
            >
              {categoriaEditando ? "Guardar cambios" : "Crear categoría"}
            </button>
          </form>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {cargando ? (
            <p className="p-8 text-center text-slate-500">
              Cargando categorías...
            </p>
          ) : error && categorias.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              No hay categorías disponibles.
            </p>
          ) : categorias.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              No hay categorías registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">Descripción</th>
                    <th className="px-4 py-3 font-semibold">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {categorias.map((categoria) => (
                    <tr key={categoria.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-500">
                        {categoria.id}
                      </td>

                      <td className="px-4 py-3 font-medium text-slate-800">
                        {categoria.nombre}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {categoria.descripcion || "Sin descripción"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => prepararEdicion(categoria)}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => eliminarCategoria(categoria)}
                            className="font-medium text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
