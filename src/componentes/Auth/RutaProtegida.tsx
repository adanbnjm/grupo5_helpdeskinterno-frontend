import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface RutaProtegidaProps {
  allowedRoles?: string[];
}

export const RutaProtegida = ({ allowedRoles }: RutaProtegidaProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.rol ? user.rol.toUpperCase() : '';
    const hasPermission = allowedRoles.map((r) => r.toUpperCase()).includes(userRole);

    if (!hasPermission) {
      return <Navigate to="/login" replace />;
    }}

  return <Outlet />;
};