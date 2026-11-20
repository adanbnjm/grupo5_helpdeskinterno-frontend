import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Notificaciones } from "../Notificaciones/Notificaciones";
import { CargandoPagina } from "./Carga";

const enlaces = [
  {
    ruta: "/dashboard",
    texto: "Inicio",
    roles: ["ADMIN", "AGENTE", "EMPLEADO"],
  },
  {
    ruta: "/tickets",
    texto: "Tickets",
    roles: ["ADMIN", "AGENTE", "EMPLEADO"],
  },
  {
    ruta: "/metricas",
    texto: "Métricas",
    roles: ["ADMIN", "AGENTE"],
  },
  {
    ruta: "/usuarios",
    texto: "Usuarios",
    roles: ["ADMIN"],
  },
];

export const LayoutPrincipal = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuEnRuta, setMenuEnRuta] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  const rol = user?.rol?.toUpperCase() ?? "";
  const menuAbierto = menuEnRuta === pathname;
  const enlacesVisibles = enlaces.filter((enlace) =>
    enlace.roles.includes(rol),
  );

  useEffect(() => {
    setCargando(true);

    const timer = window.setTimeout(() => {
      setCargando(false);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname]);

  const cerrarSesion = () => {
    setMenuEnRuta(null);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:p-3"
      >
        Saltar al contenido
      </a>

      <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white lg:hidden">
        <span className="font-semibold">Help Desk Interno</span>
        <button
          type="button"
          aria-expanded={menuAbierto}
          aria-controls="menu-principal"
          onClick={() => setMenuEnRuta(menuAbierto ? null : pathname)}
          className="rounded-lg border border-slate-600 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {menuAbierto ? "Cerrar menú" : "Abrir menú"}
        </button>
      </div>

      <aside
        id="menu-principal"
        className={`${menuAbierto ? "block" : "hidden"} bg-slate-900 text-slate-100 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto`}
      >
        <div className="hidden border-b border-slate-700 px-6 py-6 lg:block">
          <p className="text-lg font-semibold">Help Desk Interno</p>
          <p className="mt-1 text-sm text-slate-400">Centro de soporte</p>
        </div>

        <nav aria-label="Navegación principal" className="space-y-2 p-4">
          {enlacesVisibles.map((enlace) => (
            <NavLink
              key={enlace.ruta}
              to={enlace.ruta}
              onClick={() => setMenuEnRuta(null)}
              className={({ isActive }) =>
                [
                  "block rounded-lg px-4 py-3 text-sm font-medium",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                ].join(" ")
              }
            >
              {enlace.ruta === "/tickets" && rol === "EMPLEADO"
                ? "Mis tickets"
                : enlace.texto}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="break-words font-semibold">
              {user?.nombre || user?.email || "Usuario"}
            </p>
            <p className="text-sm text-slate-500">
              {rol || "Rol no disponible"}
            </p>
          </div>

          <button
            type="button"
            onClick={cerrarSesion}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Cerrar sesión
          </button>
        </header>

        <Notificaciones />

        <main id="contenido-principal" className="p-4 sm:p-6">
          {cargando ? <CargandoPagina /> : <Outlet />}
        </main>
      </div>
    </div>
  );
};