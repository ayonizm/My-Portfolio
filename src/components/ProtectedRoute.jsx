import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/dataStore';

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/admin" replace />;
    }
    return children;
};

export default ProtectedRoute;
