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

interface MetricasApi {
  total: number;
  porEstado?: MetricasTickets["porEstado"];
  estadox?: MetricasTickets["porEstado"];
  porCategoria?: MetricasTickets["porCategoria"];
  porCategorias?: MetricasTickets["porCategoria"];
}

interface RespuestaMetricas {
  data?: MetricasApi;
}

export const metricasService = {
  obtener: async (): Promise<MetricasTickets> => {
    const respuesta = await api.get<RespuestaMetricas>("/tickets/metricas");
    const datos = respuesta.data.data;

    const porEstado = datos?.porEstado ?? datos?.estadox;
    const porCategoria = datos?.porCategoria ?? datos?.porCategorias;

    if (
      !datos ||
      !porEstado ||
      !Array.isArray(porCategoria) ||
      !Number.isFinite(datos.total) ||
      ![
        porEstado.ABIERTO,
        porEstado.EN_PROCESO,
        porEstado.RESUELTO,
        porEstado.CERRADO,
      ].every((valor) => Number.isFinite(valor))
    ) {
      throw new Error("La API devolvió un formato de métricas inesperado.");
    }

    return {
      total: datos.total,
      porEstado,
      porCategoria,
    };
  },
};
