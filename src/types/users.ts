export interface LoginCredenciales {
  email: string;
  password: string;
}

export interface User {
  id: number | string;
  email: string;
  nombre?: string;
  rol?: string;
  activo?: boolean;
  creadoEn?: string;
}

export interface AuthResponseData {
  access_token?: string;
  accessToken?: string;
  token?: string;
  jwt?: string;
  user?: User;
  usuario?: User;
  id?: number | string;
  email?: string;
  nombre?: string;
  rol?: string;
}

export interface LoginResponse {
  success?: boolean;
  data?: AuthResponseData;
  access_token?: string;
  accessToken?: string;
  token?: string;
  jwt?: string;
  user?: User;
  usuario?: User;
  nombre?: string;
}