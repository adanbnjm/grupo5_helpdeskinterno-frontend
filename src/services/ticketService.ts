import { api } from '../lib/axios';
import type { Categoria, RespuestaApi, TicketsPaginados } from '../types/tickets';

export const ticketService = {
  // EMPLEADO recibe solo sus tickets; ADMIN y AGENTE reciben todos (lo filtra el backend)
  listar: async (page = 1, limit = 10): Promise<TicketsPaginados> => {
    const { data } = await api.get<RespuestaApi<TicketsPaginados>>('/tickets', {
      params: { page, limit },
    });
    return data.data;
  },

  listarCategorias: async (): Promise<Categoria[]> => {
    const { data } = await api.get<RespuestaApi<Categoria[]>>('/categorias');
    return data.data;
  },
};