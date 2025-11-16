import { useState, useEffect } from "react"
import { useAuth } from "../contexts/useAuth";
import { Navigate } from "react-router-dom";
import ImageLoader from './loader'
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  const [loading1, setLoading1] = useState(true);

  useEffect(() => {
    // Simulate a network request or data loading
    const timer = setTimeout(() => {
      setLoading1(false);
    }, 20000); // Loader will show for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div>
        {loading1 && <ImageLoader />}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
