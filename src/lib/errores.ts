import { AxiosError } from 'axios';

// Saca el mensaje que manda el backend ({ message: string | string[] }) o usa uno por defecto
export const obtenerMensajeError = (err: unknown, porDefecto: string): string => {
  const e = err as AxiosError<{ message?: string | string[] }>;
  const mensaje = e.response?.data?.message;
  if (Array.isArray(mensaje)) return mensaje[0];
  return mensaje || porDefecto;
};