import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { PaginaLogin } from "./pages/PaginaLogin";
import { PaginaDashboard } from "./pages/PaginaDashboard";
import { RutaProtegida } from "./componentes/Auth/RutaProtegida";
import { PaginaTickets } from "./pages/PaginaTickets";
import { PaginaRegistro } from "./pages/PaginaRegistro";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/registro" element={<PaginaRegistro />} />

      <Route element={<RutaProtegida />}>
        <Route path="/dashboard" element={<PaginaDashboard />} />
        <Route path="/tickets" element={<PaginaTickets />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
