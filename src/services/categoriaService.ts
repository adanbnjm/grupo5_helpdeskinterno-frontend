import { api } from "../lib/axios";
import type { Categoria, RespuestaApi } from "../types/tickets";

export const categoriaService = {
  listar: async (): Promise<Categoria[]> => {
    const { data } = await api.get<RespuestaApi<Categoria[]>>("/categorias");
    return data.data;
  },

  crear: async (categoria: {
    nombre: string;
    descripcion?: string;
  }): Promise<Categoria> => {
    const { data } = await api.post<RespuestaApi<Categoria>>(
      "/categorias",
      categoria,
    );
    return data.data;
  },

  actualizar: async (
    id: number,
    categoria: {
      nombre?: string;
      descripcion?: string;
    },
  ): Promise<Categoria> => {
    const { data } = await api.patch<RespuestaApi<Categoria>>(
      `/categorias/${id}`,
      categoria,
    );
    return data.data;
  },

  eliminar: async (id: number): Promise<Categoria> => {
    const { data } = await api.delete<RespuestaApi<Categoria>>(
      `/categorias/${id}`,
    );
    return data.data;
  },
};
