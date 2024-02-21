import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../Components/Loader/Loader";

const SellerProtectedRoutes = ({ children }) => {
  const { isSeller, seller, isSellerLoading } = useSelector(
    (state) => state.seller
  );
  if (isSellerLoading === true) {
    return <Loader />;
  }
  if (isSellerLoading === false) {
    if (!isSeller) {
      return <Navigate to={"/"} replace />;
    }
    return children;
  }
};
export default SellerProtectedRoutes;
