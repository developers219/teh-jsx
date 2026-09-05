import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
function ProtectedRoute({ children, roles = [] }) {
    const { isAuthenticated, isLoading, hasRole } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return (<main className="grid min-h-screen place-items-center bg-slate-100">
        <div className="text-center">
          <CircularProgress />
          <Typography className="mt-4 text-sm font-semibold text-slate-600">
            Checking admin session...
          </Typography>
        </div>
      </main>);
    }
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace state={{ from: location }}/>;
    }
    if (roles.length > 0 && !hasRole(roles)) {
        return <Navigate to="/unauthorized" replace/>;
    }
    return children;
}
export default ProtectedRoute;
