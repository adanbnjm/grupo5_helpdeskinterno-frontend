# Help Desk Interno - Frontend

Aplicación web del sistema **Help Desk Interno**: los empleados reportan incidencias técnicas, los agentes las atienden y los administradores gestionan usuarios, categorías y métricas.

Proyecto grupal del **Grupo 5** (FUNVAL), desarrollado con metodología Scrum.

## Enlaces

| Recurso                           | URL                                                    |
| --------------------------------- | ------------------------------------------------------ |
| Aplicación (Vercel)               | https://grupo5-helpdeskinterno-frontend.vercel.app     |
| API (Render)                      | https://grupo5-helpdeskinterno.onrender.com            |
| Documentación de la API (Swagger) | https://grupo5-helpdeskinterno.onrender.com/api        |
| Repositorio del backend           | https://github.com/urrestipaolo/grupo5_helpdeskinterno |

> La API está en el plan gratuito de Render: si no se usó en los últimos 15 minutos, el primer pedido puede tardar alrededor de un minuto mientras el servidor se reactiva.

## Usuarios de prueba

Todos usan la contraseña **`Password123`**.

| Rol      | Email                    | Qué puede hacer                                                                    |
| -------- | ------------------------ | ---------------------------------------------------------------------------------- |
| ADMIN    | `admin@helpdesk.com`     | Todo: tickets, asignación de agentes, eliminación, usuarios, categorías y métricas |
| AGENTE   | `agente@helpdesk.com`    | Ver todos los tickets, cambiar su estado, comentar, categorías y métricas          |
| EMPLEADO | `empleado@helpdesk.com`  | Crear tickets, ver y comentar solo los propios                                     |
| EMPLEADO | `empleado2@helpdesk.com` | Igual que el anterior (sirve para probar que no ve tickets ajenos)                 |

También se puede crear una cuenta nueva desde **Registrarme**; siempre se crea con rol EMPLEADO.

## Funcionalidades

- **Autenticación:** login, registro de empleados, sesión persistente y cierre de sesión.
- **Rutas protegidas por rol** y menú lateral que muestra solo las secciones permitidas.
- **Tickets:** listado paginado con badges de estado y prioridad, creación, detalle, cambio de estado (ADMIN y AGENTE), reasignación de agente, edición de prioridad y categoría, y eliminación (solo ADMIN).
- **Comentarios:** historial de cada ticket y publicación de respuestas.
- **Notificaciones en tiempo real** con Socket.io cuando cambia el estado de un ticket o llega un comentario nuevo.
- **Métricas:** totales y gráficos de tickets por estado y por categoría.
- **Administración:** gestión de usuarios (alta, cambio de rol, desactivación y reactivación) y de categorías.
- **Estados de carga, errores y página 404.**

## Requisitos

- Node.js 24 LTS. Entorno utilizado en las pruebas: Node.js 24.19.0 y npm 11.17.0.
- npm (viene con Node.js)
- Git

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/adanbnjm/grupo5_helpdeskinterno-frontend.git
   cd grupo5_helpdeskinterno-frontend
   ```

2. Instalar las dependencias:

   ```bash
   npm ci
   ```

3. Crear el archivo `.env` a partir del ejemplo:

   ```bash
   cp .env.example .env
   ```

   En Windows (PowerShell): `copy .env.example .env`

4. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abrir http://localhost:5173 e iniciar sesión con alguno de los [usuarios de prueba](#usuarios-de-prueba).

## Variables de entorno

| Variable       | Para qué sirve                                                                                   | Ejemplo                 |
| -------------- | ------------------------------------------------------------------------------------------------ | ----------------------- |
| `VITE_API_URL` | URL base de la API REST                                                                          | `http://localhost:3000` |
| `VITE_WS_URL`  | URL del servidor de WebSockets (Socket.io). El cliente se conecta al namespace `/notificaciones` | `http://localhost:3000` |

- Para trabajar contra el **backend local**, dejar los valores del ejemplo y levantar el backend (ver su README).
- Para trabajar contra el **backend publicado**, usar `https://grupo5-helpdeskinterno.onrender.com` en ambas variables.
- El archivo `.env` está en el `.gitignore`: **no se sube al repositorio**.
- Vite lee estas variables al compilar. En Vercel, después de cambiarlas hay que hacer un **Redeploy**.

### Usar el backend publicado desde el frontend local

No es necesario instalar PostgreSQL ni ejecutar el backend para consumir la API publicada.

Crea `.env.local` en la raíz del frontend:

```env
VITE_API_URL=https://grupo5-helpdeskinterno.onrender.com
VITE_WS_URL=https://grupo5-helpdeskinterno.onrender.com
```

`VITE_API_URL` debe contener el dominio sin `/api`, ya que esa ruta corresponde a Swagger. `VITE_WS_URL` debe contener el dominio sin `/notificaciones`; el cliente agrega ese namespace.

`.env.local` tiene prioridad sobre `.env`. Después de modificar las variables, reinicia el servidor:

```bash
npm run dev -- --port 5173 --strictPort
```

Al cambiar entre el backend local y Render, cierra sesión e ingresa nuevamente con una cuenta de la base de datos correspondiente.

### Probar notificaciones

1. Abre la aplicación en una ventana normal y otra de incógnito.
2. Inicia sesión como creador del ticket en una y como agente asignado en la otra.
3. Publica un comentario: el otro usuario debe recibir un aviso.
4. Cambia el estado: el destinatario debe recibir el aviso y ver los datos actualizados.
5. Cierra sesión y comprueba que se desconecten las notificaciones.

El backend notifica al creador y al agente asignado, excepto al autor de la acción. Un administrador no recibe automáticamente todos los avisos.

### Comprobaciones antes de un Pull Request

```bash
npm run build
npm run lint
git diff --check
```

Además, verifica el flujo modificado con los roles correspondientes y en vista móvil.

## Comandos disponibles

| Comando           | Función                                     |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Iniciar el servidor de desarrollo           |
| `npm run build`   | Comprobar los tipos y construir el proyecto |
| `npm run lint`    | Revisar el código con Oxlint                |
| `npm run preview` | Previsualizar la versión construida         |

## Estructura del proyecto

```
src/
├── componentes/   # Componentes reutilizables (Auth, Layout, Tickets, Comentarios)
├── lib/           # Cliente Axios y utilidades (manejo de errores)
├── pages/         # Una página por ruta
├── services/      # Llamadas a la API, agrupadas por módulo
├── store/         # Estado global de la sesión (Zustand)
├── types/         # Tipos de TypeScript compartidos
├── App.tsx        # Definición de rutas
└── main.tsx       # Punto de entrada
```

## Despliegue

El frontend se despliega en **Vercel** desde la rama `main`:

1. Conectar el repositorio en Vercel (framework: Vite).
2. Cargar `VITE_API_URL` y `VITE_WS_URL` en _Settings → Environment Variables_.
3. El archivo `vercel.json` redirige todas las rutas a `index.html`, así recargar una ruta interna (por ejemplo `/tickets/3`) no da error 404.

El backend tiene que permitir el dominio de Vercel en su configuración de CORS.

## Flujo de trabajo

- Cada historia de usuario se desarrolla en su propia rama: `feature/US-XX-descripcion-corta`.
- Los cambios entran a `main` mediante Pull Request revisado por otro integrante.
- El tablero del sprint está en Trello.

## Tecnologías

- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Zustand
- Socket.io Client
- Recharts
- Oxlint

## Equipo

Grupo 5 - FUNVAL: Paolo Urresti, Natanael Florentin, Jared Linares y Adán Cotaña (Scrum Master).
