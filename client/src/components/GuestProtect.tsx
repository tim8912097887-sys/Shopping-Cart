import type { RootState } from "@stores/store"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

const GuestProtect = () => {

    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    // Send user to home page is authenticated
    if(accessToken) {
        return <Navigate to="/" replace />
    }
  return <Outlet/>
}

export default GuestProtect