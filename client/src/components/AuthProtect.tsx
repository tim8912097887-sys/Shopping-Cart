import type { RootState } from "@/stores/store"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

const AuthProtect = () => {

    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    // Navigate to Login page if not authenticated
    if(!accessToken) {
        return <Navigate to="/login" replace/>
    }
  return <Outlet/>;
}

export default AuthProtect