import { api } from '../lib/axios';
import type {
  ActualizarTicketDto,
  Categoria,
  CrearTicketDto,
  FiltrosTickets,
  RespuestaApi,
  Ticket,
  TicketsPaginados,
  UsuarioResumen,
} from '../types/tickets';

export const ticketService = {
  // EMPLEADO recibe solo sus tickets; ADMIN y AGENTE reciben todos (lo filtra el backend)
  // Los filtros vacíos no se mandan, así el backend devuelve todo como antes
  listar: async (page = 1, limit = 10, filtros: FiltrosTickets = {}): Promise<TicketsPaginados> => {
    const filtrosActivos = Object.fromEntries(
      Object.entries(filtros).filter(([, valor]) => valor !== undefined && valor !== ''),
    );
    const { data } = await api.get<RespuestaApi<TicketsPaginados>>('/tickets', {
      params: { page, limit, ...filtrosActivos },
    });
    return data.data;
  },

  obtener: async (id: number): Promise<Ticket> => {
    const { data } = await api.get<RespuestaApi<Ticket>>(`/tickets/${id}`);
    return data.data;
  },

  crear: async (dto: CrearTicketDto): Promise<Ticket> => {
    const { data } = await api.post<RespuestaApi<Ticket>>('/tickets', dto);
    return data.data;
  },

  // ADMIN y AGENTE cambian el estado; solo ADMIN reasigna agente, prioridad o categoría
  actualizar: async (id: number, dto: ActualizarTicketDto): Promise<Ticket> => {
    const { data } = await api.patch<RespuestaApi<Ticket>>(`/tickets/${id}`, dto);
    return data.data;
  },

  // Solo ADMIN (el backend lo valida)
  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },

  listarCategorias: async (): Promise<Categoria[]> => {
    const { data } = await api.get<RespuestaApi<Categoria[]>>('/categorias');
    return data.data;
  },

  // Solo ADMIN y AGENTE pueden listar usuarios; se usa para asignar un agente
  listarAgentes: async (): Promise<UsuarioResumen[]> => {
    const { data } = await api.get<RespuestaApi<{ data: UsuarioResumen[] }>>('/usuarios', {
      params: { rol: 'AGENTE', limit: 100 },
    });
    return data.data.data;
  },
};