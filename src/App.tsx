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
import { RutaProtegida } from "./componentes/Auth/RutaProtegida";
import { LayoutPrincipal } from "./componentes/Layout/LayoutPrincipal";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/registro" element={<PaginaRegistro />} />

      <Route element={<RutaProtegida />}>
        <Route element={<LayoutPrincipal />}>
          <Route path="/dashboard" element={<PaginaDashboard />} />
          <Route path="/tickets" element={<PaginaTickets />} />
          <Route path="/tickets/nuevo" element={<PaginaNuevoTicket />} />
          <Route path="/tickets/:id" element={<PaginaDetalleTicket />} />
          <Route
            path="/tickets/:id/comentarios"
            element={<PaginaComentarios />}
          />

          <Route element={<RutaProtegida allowedRoles={["ADMIN", "AGENTE"]} />}>
            <Route path="/metricas" element={<PaginaMetricas />} />
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
