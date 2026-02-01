import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import { lazy } from "react";

const Home = lazy(() => import("@pages/Home"));
const Deals = lazy(() => import("@pages/Deals"));
const Login = lazy(() => import("@pages/Login"));
const SignUp = lazy(() => import("@pages/SignUp"));
const Cart = lazy(() => import("@pages/Cart"));
const Profile = lazy(() => import("@pages/Profile"));
const AuthProtect = lazy(() => import("@components/AuthProtect"));
const GuestProtect = lazy(() => import("@components/GuestProtect"));

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
                Component: AuthProtect,
                children: [
                    {
                        path: "cart",
                        Component: Cart
                    },
                    {
                        path: "deals",
                        Component: Deals
                    },
                    {
                        path: "profile",
                        Component: Profile
                    }
                ]
            },
            {
                Component: GuestProtect,
                children: [
                    {
                        path: "login",
                        Component: Login
                    },
                    {
                        path: "signup",
                        Component: SignUp
                    }
                ]
            }
        ]
    }
])