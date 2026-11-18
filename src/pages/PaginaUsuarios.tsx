import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { usuarioService } from "../services/usuarioService";
import type { User } from "../types/users";
import type { MetaPaginacion } from "../types/tickets";

const LIMITE = 10;

export const PaginaUsuarios = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [meta, setMeta] = useState<MetaPaginacion | null>(null);
  const [pagina, setPagina] = useState(1);
  const [rolFiltro, setRolFiltro] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("EMPLEADO");
  const [usuarioEditando, setUsuarioEditando] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarUsuarios = async () => {
      setCargando(true);
      setError(null);

      try {
        const respuesta = await usuarioService.listar({
          page: pagina,
          limit: LIMITE,
          ...(rolFiltro && { rol: rolFiltro }),
        });

        setUsuarios(respuesta.data);
        setMeta(respuesta.meta);
      } catch (err) {
        const e = err as AxiosError<{ message?: string | string[] }>;
        const mensaje = e.response?.data?.message;

        setError(
          Array.isArray(mensaje)
            ? mensaje[0]
            : mensaje || "No se pudieron cargar los usuarios.",
        );
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, [pagina, rolFiltro]);

  const totalPaginas = meta?.totalPages ?? 1;

  const seleccionarUsuario = (usuario: User) => {
    setUsuarioEditando(usuario);
    setNombre(usuario.nombre || "");
    setEmail(usuario.email);
    setPassword("");
    setRol(usuario.rol || "EMPLEADO");
    setMostrarFormulario(true);
  };
  const actualizarUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!usuarioEditando) return;

    setError(null);

    try {
      await usuarioService.actualizar(usuarioEditando.id as number, {
        nombre,
        email,
        rol,
        ...(password && { password }),
      });

      setUsuarioEditando(null);
      setNombre("");
      setEmail("");
      setPassword("");
      setRol("EMPLEADO");
      setMostrarFormulario(false);

      const respuesta = await usuarioService.listar({
        page: pagina,
        limit: LIMITE,
        ...(rolFiltro && { rol: rolFiltro }),
      });

      setUsuarios(respuesta.data);
      setMeta(respuesta.meta);
    } catch (err) {
      const e = err as AxiosError<{ message?: string | string[] }>;
      const mensaje = e.response?.data?.message;

      setError(
        Array.isArray(mensaje)
          ? mensaje[0]
          : mensaje || "No se pudo actualizar el usuario.",
      );
    }
  };

  const crearUsuario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    try {
      await usuarioService.crear({
        nombre,
        email,
        password,
        rol,
      });

      // Limpiar los campos
      setNombre("");
      setEmail("");
      setPassword("");
      setRol("EMPLEADO");

      // Cerrar el formulario
      setMostrarFormulario(false);

      // Actualizar el listado
      const respuesta = await usuarioService.listar({
        page: pagina,
        limit: LIMITE,
        ...(rolFiltro && { rol: rolFiltro }),
      });

      setUsuarios(respuesta.data);
      setMeta(respuesta.meta);
    } catch (err) {
      const e = err as AxiosError<{ message?: string | string[] }>;
      const mensaje = e.response?.data?.message;

      setError(
        Array.isArray(mensaje)
          ? mensaje[0]
          : mensaje || "No se pudo crear el usuario.",
      );
    }
  };
  const cambiarEstadoUsuario = async (usuario: User) => {
    const accion = usuario.activo ? "desactivar" : "reactivar";

    const confirmado = window.confirm(
      `¿Estás seguro de que deseas ${accion} a ${usuario.nombre}?`,
    );

    if (!confirmado) return;

    setError(null);

    try {
      if (usuario.activo) {
        await usuarioService.desactivar(usuario.id as number);
      } else {
        await usuarioService.reactivar(usuario.id as number);
      }

      const respuesta = await usuarioService.listar({
        page: pagina,
        limit: LIMITE,
        ...(rolFiltro && { rol: rolFiltro }),
      });

      setUsuarios(respuesta.data);
      setMeta(respuesta.meta);
    } catch (err) {
      const e = err as AxiosError<{ message?: string | string[] }>;
      const mensaje = e.response?.data?.message;

      setError(
        Array.isArray(mensaje)
          ? mensaje[0]
          : mensaje || `No se pudo ${accion} el usuario.`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Administración de usuarios
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {meta
              ? `${meta.total} usuarios encontrados`
              : "Gestiona los usuarios del sistema"}
          </p>

          <div className="mt-4">
            <label
              htmlFor="filtroRol"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Filtrar por rol
            </label>

            <select
              id="filtroRol"
              value={rolFiltro}
              onChange={(e) => {
                setRolFiltro(e.target.value);
                setPagina(1);
              }}
              className="w-full sm:w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los roles</option>
              <option value="ADMIN">Administrador</option>
              <option value="AGENTE">Agente</option>
              <option value="EMPLEADO">Empleado</option>
            </select>
          </div>
          <button
            type="button"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
          >
            {mostrarFormulario ? "Cancelar" : "+ Crear usuario"}
          </button>
        </div>
        {mostrarFormulario && (
          <form
            onSubmit={usuarioEditando ? actualizarUsuario : crearUsuario}
            className="mb-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              {usuarioEditando ? "Editar usuario" : "Registrar nuevo usuario"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  minLength={2}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!usuarioEditando}
                  minLength={usuarioEditando ? 8 : 6}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              {usuarioEditando && (
                <p className="mt-1 text-xs text-slate-500">
                  Déjala vacía si no deseas cambiarla.
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Rol
                </label>
                <select
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="EMPLEADO">Empleado</option>
                  <option value="AGENTE">Agente</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 cursor-pointer"
            >
              {usuarioEditando ? "Guardar cambios" : "Guardar usuario"}
            </button>
          </form>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          {cargando ? (
            <p className="p-8 text-center text-slate-500">
              Cargando usuarios...
            </p>
          ) : error ? (
            <p className="p-8 text-center text-red-600">{error}</p>
          ) : usuarios.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              No hay usuarios para mostrar.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">Correo</th>
                    <th className="px-4 py-3 font-semibold">Rol</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Creado</th>
                    <th className="px-4 py-3 font-semibold">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-500">{usuario.id}</td>

                      <td className="px-4 py-3 font-medium text-slate-800">
                        {usuario.nombre || "Sin nombre"}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {usuario.email}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {usuario.rol || "Sin rol"}
                      </td>

                      <td className="px-4 py-3">
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </td>

                      <td className="px-4 py-3 text-slate-500">
                        {usuario.creadoEn
                          ? new Date(usuario.creadoEn).toLocaleDateString(
                              "es-BO",
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => seleccionarUsuario(usuario)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => cambiarEstadoUsuario(usuario)}
                            className={`text-sm font-medium hover:underline cursor-pointer ${
                              usuario.activo
                                ? "text-red-600 hover:text-red-800"
                                : "text-green-600 hover:text-green-800"
                            }`}
                          >
                            {usuario.activo ? "Desactivar" : "Reactivar"}
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

        {meta && totalPaginas > 1 && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPagina((p) => p - 1)}
              disabled={pagina <= 1 || cargando}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              ← Anterior
            </button>

            <span className="text-sm text-slate-600">
              Página {pagina} de {totalPaginas}
            </span>

            <button
              onClick={() => setPagina((p) => p + 1)}
              disabled={pagina >= totalPaginas || cargando}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
