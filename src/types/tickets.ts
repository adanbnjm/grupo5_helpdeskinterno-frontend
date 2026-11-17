export type EstadoTicket = 'ABIERTO' | 'EN_PROCESO' | 'RESUELTO' | 'CERRADO';
export type Prioridad = 'BAJA' | 'MEDIA' | 'ALTA';

export interface Ticket {
  id: number;
  titulo: string;
  descripcion: string;
  estado: EstadoTicket;
  prioridad: Prioridad;
  creadoEn: string;
  actualizadoEn: string;
  cerradoEn: string | null;
  creadorId: number;
  agenteId: number | null;
  categoriaId: number;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  activa: boolean;
}

export interface MetaPaginacion {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketsPaginados {
  data: Ticket[];
  meta: MetaPaginacion;
}

// Toda respuesta del backend viene envuelta así (TransformInterceptor)
export interface RespuestaApi<T> {
  success: boolean;
  data: T;
  timestamp: string;
}