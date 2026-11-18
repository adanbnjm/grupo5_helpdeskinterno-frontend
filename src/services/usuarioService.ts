import { api } from "../lib/axios";
import type { User } from "../types/users";
import type { MetaPaginacion, RespuestaApi } from "../types/tickets";

export interface UsuariosPaginados {
  data: User[];
  meta: MetaPaginacion;
}

export interface FiltrosUsuarios {
  rol?: string;
  page?: number;
  limit?: number;
}

export interface CrearUsuario {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

export interface ActualizarUsuario {
  nombre?: string;
  email?: string;
  password?: string;
  rol?: string;
}

export const usuarioService = {
  listar: async (filtros: FiltrosUsuarios = {}): Promise<UsuariosPaginados> => {
    const { data } = await api.get<RespuestaApi<UsuariosPaginados>>(
      "/usuarios",
      { params: filtros },
    );

    return data.data;
  },

  crear: async (usuario: CrearUsuario): Promise<User> => {
    const { data } = await api.post<RespuestaApi<User>>("/usuarios", usuario);

    return data.data;
  },

  actualizar: async (id: number, usuario: ActualizarUsuario): Promise<User> => {
    const { data } = await api.patch<RespuestaApi<User>>(
      `/usuarios/${id}`,
      usuario,
    );

    return data.data;
  },

  desactivar: async (id: number): Promise<User> => {
    const { data } = await api.delete<RespuestaApi<User>>(`/usuarios/${id}`);

    return data.data;
  },

  reactivar: async (id: number): Promise<User> => {
    const { data } = await api.patch<RespuestaApi<User>>(
      `/usuarios/${id}/reactivate`,
    );

    return data.data;
  },
};
