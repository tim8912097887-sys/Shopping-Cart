import { renderWithProvider } from "@/test/renderWithProvider";
import { renderWithRouter } from "@/test/renderWithRouter";
import Header from "./Header";
import { screen } from "@testing-library/react";

describe("Header Unit Test",() => {
    it('When accessToken is empty string,Login and Signup Link should appear', () => {
        // Arrange
        const accessToken = "";
        // Act
        renderWithProvider(
            renderWithRouter(<Header/>,["/"]),
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
        expect(screen.getByRole("link",{ name: /login/i })).toHaveAttribute("href","/login");
        expect(screen.getByRole("link",{ name: /signup/i })).toHaveAttribute("href","/signup");
        const links = screen.getAllByRole("link");
        links.forEach(link => {
           expect(link).not.toHaveAttribute("href","/profile");
        })
    
    })

    it('When accessToken is non-empty string,Profile Link should appear', () => {
        // Arrange
        const accessToken = "fake-accessToken";
        // Act
        renderWithProvider(
            renderWithRouter(<Header/>,["/"]),
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
        expect(screen.queryByRole("link",{ name: /login/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("link",{ name: /signup/i })).not.toBeInTheDocument();
        expect(screen.getByTestId("profile_link")).toBeInTheDocument();
    })
})