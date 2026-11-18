import { api } from "../lib/axios";

export interface Comentario {
  id: number;
  contenido: string;
  creadoEn: string;
  ticketId: number;
  autor: {
    id: number;
    nombre: string;
    rol: string;
  };
}

interface Respuesta<T> {
  data: T;
}

export const comentariosService = {
  listar: async (ticketId: number): Promise<Comentario[]> => {
    const respuesta = await api.get<Respuesta<Comentario[]>>(
      `/tickets/${ticketId}/comentarios`,
    );
    return respuesta.data.data;
  },

  publicar: async (
    ticketId: number,
    contenido: string,
  ): Promise<Comentario> => {
    const respuesta = await api.post<Respuesta<Comentario>>(
      `/tickets/${ticketId}/comentarios`,
      { contenido },
    );
    return respuesta.data.data;
  },
};
