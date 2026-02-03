import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { renderWithProvider } from "@/test/renderWithProvider";
import { renderWithQueryProvider } from "@/test/renderWithQueryProvider";
import { Route, Routes } from "react-router-dom";
import GuestProtect from "./GuestProtect";
import { renderWithRouter } from "@/test/renderWithRouter";
import { screen } from "@testing-library/react";

describe("GuestProtect Unit Test",() => {
    it('When accessToken is empty string,render Login Page', () => {
        // Arrange
        const accessToken = "";
        // Act
        renderWithProvider(
            renderWithQueryProvider(
              renderWithRouter(
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route element={<GuestProtect/>}>
                            <Route path="/login" element={<Login/>} />
                        </Route>
                    </Routes>,
                    ["/login"]
                )
            ),
            {
                preloadedState: {
                    auth: {
                        accessToken,
                        isPersistent: false
                    }
                }
            }
        )
        // Assertion
        expect(screen.queryByText(/home/i)).not.toBeInTheDocument();
        expect(screen.getByRole("button",{ name: /login/i })).toBeInTheDocument();
    })

    it('When accessToken is non-empty string,redirect to Home Page', () => {
        // Arrange
        const accessToken = "fake-accessToken";
        // Act
        renderWithProvider(
            renderWithQueryProvider(
              renderWithRouter(
                    <Routes>
                        <Route path="/" element={<Home/>} />
                        <Route element={<GuestProtect/>}>
                            <Route path="/login" element={<Login/>} />
                        </Route>
                    </Routes>,
                    ["/login"]
                )
            ),
            {
                preloadedState: {
                    auth: {
                        accessToken,
                        isPersistent: false
                    }
                }
            }
        )
        // Assertion
        expect(screen.getByText(/home/i)).toBeInTheDocument();
        expect(screen.queryByRole("button",{ name: /login/i })).not.toBeInTheDocument();
    })
})