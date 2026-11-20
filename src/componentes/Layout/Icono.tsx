const trazos: Record<string, string> = {
  inicio: 'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
  tickets: 'M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4V5Zm11 3v2m0 4v2',
  metricas: 'M4 4v16h17M8 16v-5m5 5V7m5 9v-7',
  usuarios: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m18 0v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-7a4 4 0 0 1 0 7.75',
  perfil: 'M20 21v-2a7 7 0 0 0-14 0v2M13 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  salir: 'M9 21H4V3h5m5 4 5 5-5 5m-7-5h12',
  soporte: 'M4 13v-1a8 8 0 0 1 16 0v1M4 12H2v7h5v-7H4Zm16 0h2v7h-5v-7h3Zm0 7v2h-7',
};

export const Icono = ({ nombre, className = '' }: { nombre: string; className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={trazos[nombre] ?? trazos.tickets} />
  </svg>
);
