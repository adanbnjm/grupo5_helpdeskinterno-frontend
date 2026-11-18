import { api } from '../lib/axios';
import type {
  Categoria,
  CrearTicketDto,
  RespuestaApi,
  Ticket,
  TicketsPaginados,
  UsuarioResumen,
} from '../types/tickets';

export const ticketService = {
  // EMPLEADO recibe solo sus tickets; ADMIN y AGENTE reciben todos (lo filtra el backend)
  listar: async (page = 1, limit = 10): Promise<TicketsPaginados> => {
    const { data } = await api.get<RespuestaApi<TicketsPaginados>>('/tickets', {
      params: { page, limit },
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