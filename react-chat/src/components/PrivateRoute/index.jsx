import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const PrivateRoute = () => {
    const { tokens } = useAuthStore();

    const isTokenValid = () => {
        if (!tokens?.access) return false;
        const { exp } = JSON.parse(atob(tokens.access.split('.')[1]));
        return Date.now() < exp * 1000;
    };

    return isTokenValid() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
