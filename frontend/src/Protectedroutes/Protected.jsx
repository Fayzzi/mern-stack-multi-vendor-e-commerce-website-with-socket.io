import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../Components/Loader/Loader";
import LotieLoader from "../Components/Loader/LotieLoader";

export default function ProtectedRoutes({ children }) {
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  if (loading) {
    return <LotieLoader />;
  }
  if (!isAuthenticated && !loading) {
    return <Navigate to={"/login"} replace />;
  }
  return children;
}
