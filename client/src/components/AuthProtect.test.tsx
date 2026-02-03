import Login from "@/pages/Login";
import { renderWithProvider } from "@/test/renderWithProvider";
import { Route, Routes } from "react-router-dom";
import AuthProtect from "@components/AuthProtect";
import Cart from "@/pages/Cart";
import { screen } from "@testing-library/react";
import { renderWithRouter } from "@/test/renderWithRouter";
import { renderWithQueryProvider } from "@/test/renderWithQueryProvider";

describe("AuthProtect Unit Test",() => {
    it('When accessToken is empty string,redirect to Login Page', () => {
        // Arrange
        const accessToken = "";
        // Act
        renderWithProvider(
            renderWithQueryProvider(
              renderWithRouter(
                    <Routes>
                        <Route path="/login" element={<Login/>} />
                        <Route element={<AuthProtect/>}>
                            <Route path="/cart" element={<Cart/>} />
                        </Route>
                    </Routes>,
                    ["/cart"]
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
        expect(screen.queryByText(/cart/i)).not.toBeInTheDocument();
        expect(screen.getByRole("button",{ name: /login/i }));
    })

    it('When accessToken is non-empty string,render the Children Component', () => {
        // Arrange
        const accessToken = "fake-accessToken";
        // Act
        renderWithProvider(
            renderWithQueryProvider(
              renderWithRouter(
                    <Routes>
                        <Route path="/login" element={<Login/>} />
                        <Route element={<AuthProtect/>}>
                            <Route path="/cart" element={<Cart/>} />
                        </Route>
                    </Routes>,
                    ["/cart"]
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
        expect(screen.getByText(/cart/i)).toBeInTheDocument();
        expect(screen.queryByRole("button",{ name: /login/i })).not.toBeInTheDocument();
    })
})