import type { EstadoTicket, Prioridad } from '../../types/tickets';

const estilosEstado: Record<EstadoTicket, string> = {
  ABIERTO: 'bg-blue-50 text-blue-700 border-blue-200',
  EN_PROCESO: 'bg-amber-50 text-amber-700 border-amber-200',
  RESUELTO: 'bg-green-50 text-green-700 border-green-200',
  CERRADO: 'bg-slate-100 text-slate-600 border-slate-300',
};

const textoEstado: Record<EstadoTicket, string> = {
  ABIERTO: 'Abierto',
  EN_PROCESO: 'En proceso',
  RESUELTO: 'Resuelto',
  CERRADO: 'Cerrado',
};

const estilosPrioridad: Record<Prioridad, string> = {
  BAJA: 'bg-slate-50 text-slate-600 border-slate-200',
  MEDIA: 'bg-orange-50 text-orange-700 border-orange-200',
  ALTA: 'bg-red-50 text-red-700 border-red-200',
};

const base = 'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border';

export const BadgeEstado = ({ estado }: { estado: EstadoTicket }) => (
  <span className={`${base} ${estilosEstado[estado]}`}>{textoEstado[estado]}</span>
);

export const BadgePrioridad = ({ prioridad }: { prioridad: Prioridad }) => (
  <span className={`${base} ${estilosPrioridad[prioridad]}`}>{prioridad}</span>
);