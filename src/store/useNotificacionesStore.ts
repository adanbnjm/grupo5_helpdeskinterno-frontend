import { create } from "zustand";

interface Aviso {
  id: number;
  ticketId: number;
  mensaje: string;
}

interface NotificacionesState {
  avisos: Aviso[];
  revision: number;
  agregar: (aviso: Aviso) => void;
  quitar: (id: number) => void;
  actualizar: () => void;
  limpiar: () => void;
}

export const useNotificacionesStore = create<NotificacionesState>((set) => ({
  avisos: [],
  revision: 0,

  agregar: (aviso) =>
    set((state) => ({
      avisos: [...state.avisos, aviso].slice(-5),
      revision: state.revision + 1,
    })),

  quitar: (id) =>
    set((state) => ({
      avisos: state.avisos.filter((aviso) => aviso.id !== id),
    })),

  actualizar: () => set((state) => ({ revision: state.revision + 1 })),

  limpiar: () => set({ avisos: [], revision: 0 }),
}));
