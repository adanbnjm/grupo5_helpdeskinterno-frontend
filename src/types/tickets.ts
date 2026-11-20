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
  // Relaciones: el backend las incluye en GET /tickets y GET /tickets/:id
  creador?: UsuarioResumen;
  agente?: UsuarioResumen | null;
  categoria?: { id: number; nombre: string };
}

export interface UsuarioResumen {
  id: number;
  nombre: string;
  email?: string;
  rol?: string;
}

// Lo que se manda a POST /tickets
export interface CrearTicketDto {
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  categoriaId: number;
  agenteId?: number; // solo ADMIN puede enviarlo
}

// Lo que se manda a PATCH /tickets/:id (solo los campos que cambian)
export interface ActualizarTicketDto {
  estado?: EstadoTicket;
  prioridad?: Prioridad;
  categoriaId?: number;
  agenteId?: number; // solo ADMIN
}

// Filtros opcionales del listado (GET /tickets). Vacío = sin filtrar
export interface FiltrosTickets {
  estado?: EstadoTicket | '';
  prioridad?: Prioridad | '';
  categoriaId?: string;
  agenteId?: string; // '0' = sin asignar
  desde?: string; // AAAA-MM-DD
  hasta?: string; // AAAA-MM-DD
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