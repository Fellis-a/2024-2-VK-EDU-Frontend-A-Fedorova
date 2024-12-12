import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const PublicRoute = () => {
    const { tokens } = useAuthStore();

    const isTokenValid = () => {
        if (!tokens?.access) return false;
        const { exp } = JSON.parse(atob(tokens.access.split('.')[1]));
        return Date.now() < exp * 1000;
    };

    return isTokenValid() ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
