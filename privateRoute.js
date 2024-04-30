import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isSessionActive, setSessionActive] = useState(isAuthenticated);

  const handleStorageChange = useCallback((event) => {
    if (event.storageArea === sessionStorage && sessionStorage.length === 0) {
      setSessionActive(false);
      dispatch(logoutUser());
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleStorageChange]);

  if (!isSessionActive) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
