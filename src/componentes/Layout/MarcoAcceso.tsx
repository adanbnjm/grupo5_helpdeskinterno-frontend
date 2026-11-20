import type { ReactNode } from 'react';
import { Icono } from './Icono';

export const MarcoAcceso = ({ children }: { children: ReactNode }) => (
  <div className="access-shell">
    <aside className="access-story">
      <div className="brand"><span className="brand-mark"><Icono nombre="soporte" /></span><span>Help Desk <strong>Interno</strong></span></div>
      <div className="access-story-content">
        <p className="access-caption">Centro de soporte · Grupo 5</p>
        <h2>El soporte empieza<br />con una conversación.</h2>
        <p>Reporta una incidencia, coordina con el equipo y sigue cada paso hasta su solución.</p>
        <div className="support-flow" aria-label="Flujo de atención">
          <div><span>01</span><p>Reportar<small>Describe tu incidencia</small></p></div>
          <div><span>02</span><p>Coordinar<small>Conversa con soporte</small></p></div>
          <div><span>03</span><p>Resolver<small>Sigue el estado del ticket</small></p></div>
        </div>
      </div>
      <p className="access-footer">Help Desk Interno / FUNVAL</p>
    </aside>
    <main className="access-form-side">
      <div className="access-form">{children}</div>
    </main>
  </div>
);
