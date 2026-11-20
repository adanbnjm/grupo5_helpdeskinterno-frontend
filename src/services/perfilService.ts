import { api } from "../lib/axios";

export interface Perfil {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  creadoEn: string;
}

export const perfilService = {
  obtener: async (): Promise<Perfil> => {
    const respuesta = await api.get<{ data: Perfil }>("/auth/perfil");
    return respuesta.data.data;
  },
};
