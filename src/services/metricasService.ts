import { api } from "../lib/axios";

export interface MetricasTickets {
  total: number;
  porEstado: {
    ABIERTO: number;
    EN_PROCESO: number;
    RESUELTO: number;
    CERRADO: number;
  };
  porCategoria: {
    id: number;
    nombre: string;
    total: number;
  }[];
}

interface RespuestaMetricas {
  data: MetricasTickets;
}

export const metricasService = {
  obtener: async (): Promise<MetricasTickets> => {
    const respuesta = await api.get<RespuestaMetricas>("/tickets/metricas");
    return respuesta.data.data;
  },
};
