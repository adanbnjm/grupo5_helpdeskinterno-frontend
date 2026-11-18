import { create } from "zustand";
import { AxiosError } from "axios";
import { authService } from "../services/authService";
import type {
  LoginCredenciales,
  RegistroCredenciales,
  User,
  AuthResponseData,
} from "../types/users";

interface JwtPayload {
  sub?: number | string;
  id?: number | string;
  email?: string;
  nombre?: string;
  rol?: string;
}
const decodeJwtUser = (token: string): User | null => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const decoded: JwtPayload = JSON.parse(jsonPayload);
    if (decoded.email || decoded.nombre) {
      return {
        id: decoded.sub ?? decoded.id ?? "",
        email: decoded.email ?? "",
        nombre: decoded.nombre,
        rol: decoded.rol,
      };
    }
    return null;
  } catch {
    return null;
  }
};

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredenciales) => Promise<boolean>;
  register: (credentials: RegistroCredenciales) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const responseData: AuthResponseData = response.data ?? response;

      const jwt =
        responseData.access_token ||
        responseData.accessToken ||
        responseData.token ||
        responseData.jwt;

      if (!jwt) {
        throw new Error("El servidor no devolvió un token válido.");
      }

      const userData: User | null =
        responseData.user ||
        responseData.usuario ||
        (responseData.nombre && responseData.id
          ? (responseData as User)
          : null) ||
        decodeJwtUser(jwt);

      localStorage.setItem("token", jwt);
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }

      set({
        token: jwt,
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });

      return true;
    } catch (err) {
      const error = err as AxiosError<{ message?: string | string[] }>;
      const backendMessage = error.response?.data?.message;
      const errorMessage = Array.isArray(backendMessage)
        ? backendMessage[0]
        : backendMessage ||
          (err instanceof Error
            ? err.message
            : "Credenciales incorrectas o error de conexión.");

      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });

      return false;
    }
  },
  register: async (credentials) => {
    set({ isLoading: true, error: null });

    try {
      await authService.register(credentials);

      set({
        isLoading: false,
        error: null,
      });

      return true;
    } catch (err) {
      const error = err as AxiosError<{ message?: string | string[] }>;
      const backendMessage = error.response?.data?.message;

      const errorMessage = Array.isArray(backendMessage)
        ? backendMessage[0]
        : backendMessage ||
          (err instanceof Error
            ? err.message
            : "No se pudo registrar el empleado.");

      set({
        error: errorMessage,
        isLoading: false,
      });

      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
