import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Home from "@pages/Home";
import Deals from "@pages/Deals";
import Login from "@pages/Login";
import SignUp from "@pages/SignUp";
import Cart from "@pages/Cart";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: App,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: "deals",
                Component: Deals
            },
            {
                path: "login",
                Component: Login
            },
            {
                path: "signup",
                Component: SignUp
            },
            {
                path: "cart",
                Component: Cart
            }
        ]
    }
])