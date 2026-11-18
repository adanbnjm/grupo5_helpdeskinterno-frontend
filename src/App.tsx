import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { PaginaLogin } from "./pages/PaginaLogin";
import { PaginaDashboard } from "./pages/PaginaDashboard";
import { RutaProtegida } from "./componentes/Auth/RutaProtegida";
import { PaginaTickets } from "./pages/PaginaTickets";
import { PaginaNuevoTicket } from "./pages/PaginaNuevoTicket";
import { PaginaDetalleTicket } from "./pages/PaginaDetalleTicket";
import { PaginaRegistro } from "./pages/PaginaRegistro";
import { PaginaUsuarios } from "./pages/PaginaUsuarios";
import { LayoutPrincipal } from "./componentes/Layout/LayoutPrincipal";
import { PaginaMetricas } from "./pages/PaginaMetricas";
import { PaginaComentarios } from "./pages/PaginaComentarios";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/registro" element={<PaginaRegistro />} />

      {/* Cualquier usuario logueado. El EMPLEADO ve y crea sus propios tickets (el back filtra) */}
      <Route element={<RutaProtegida />}>
        <Route path="/dashboard" element={<PaginaDashboard />} />
        <Route path="/tickets" element={<PaginaTickets />} />
        <Route path="/tickets/nuevo" element={<PaginaNuevoTicket />} />
        <Route path="/tickets/:id" element={<PaginaDetalleTicket />} />
      </Route>

      <Route element={<RutaProtegida allowedRoles={["ADMIN"]} />}>
        <Route path="/usuarios" element={<PaginaUsuarios />} />
        <Route element={<LayoutPrincipal />}>
          <Route element={<RutaProtegida allowedRoles={["ADMIN", "AGENTE"]} />}>
            <Route path="/metricas" element={<PaginaMetricas />} />
          </Route>
          <Route path="/dashboard" element={<PaginaDashboard />} />

          <Route
            element={
              <RutaProtegida allowedRoles={["ADMIN", "AGENTE", "EMPLEADO"]} />
            }
          >
            <Route path="/tickets" element={<PaginaTickets />} />
            <Route
              path="/tickets/:id/comentarios"
              element={<PaginaComentarios />}
            />
          </Route>

          <Route element={<RutaProtegida allowedRoles={["ADMIN"]} />}>
            <Route path="/usuarios" element={<PaginaUsuarios />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;