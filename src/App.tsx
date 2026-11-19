import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import { PaginaLogin } from "./pages/PaginaLogin";
import { PaginaRegistro } from "./pages/PaginaRegistro";
import { PaginaDashboard } from "./pages/PaginaDashboard";
import { PaginaTickets } from "./pages/PaginaTickets";
import { PaginaNuevoTicket } from "./pages/PaginaNuevoTicket";
import { PaginaDetalleTicket } from "./pages/PaginaDetalleTicket";
import { PaginaUsuarios } from "./pages/PaginaUsuarios";
import { PaginaMetricas } from "./pages/PaginaMetricas";
import { PaginaComentarios } from "./pages/PaginaComentarios";
import { PaginaSinPermisos } from "./pages/PaginaSinPermisos";
import { Pagina404 } from "./pages/Pagina404";

import { RutaProtegida } from "./componentes/Auth/RutaProtegida";
import { LayoutPrincipal } from "./componentes/Layout/LayoutPrincipal";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/registro" element={<PaginaRegistro />} />

      {/* Rutas para usuarios autenticados */}
      <Route element={<RutaProtegida />}>
        <Route element={<LayoutPrincipal />}>
          <Route path="/sin-permisos" element={<PaginaSinPermisos />} />
          <Route path="/dashboard" element={<PaginaDashboard />} />
          <Route path="/tickets" element={<PaginaTickets />} />
          <Route path="/tickets/nuevo" element={<PaginaNuevoTicket />} />
          <Route path="/tickets/:id" element={<PaginaDetalleTicket />} />
          <Route
            path="/tickets/:id/comentarios"
            element={<PaginaComentarios />}
          />
        </Route>
      </Route>

      {/* Rutas para ADMIN y AGENTE */}
      <Route element={<RutaProtegida allowedRoles={["ADMIN", "AGENTE"]} />}>
        <Route element={<LayoutPrincipal />}>
          <Route path="/metricas" element={<PaginaMetricas />} />
        </Route>
      </Route>

      {/* Rutas exclusivas para ADMIN */}
      <Route element={<RutaProtegida allowedRoles={["ADMIN"]} />}>
        <Route element={<LayoutPrincipal />}>
          <Route path="/usuarios" element={<PaginaUsuarios />} />
        </Route>
      </Route>

      {/* Redirección y página no encontrada */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Pagina404 />} />
    </Routes>
  );
}

export default App;
