import { renderWithProvider } from "@/test/renderWithProvider";
import { renderWithQueryProvider } from "@/test/renderWithQueryProvider";
import { renderWithRouter } from "@/test/renderWithRouter";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent, type UserEvent } from "@testing-library/user-event"
import SignUp from "./SignUp";
import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import { server } from "@/test/setup";
import { http, HttpResponse } from "msw";

describe("SignUp Integration Test",() => {

    const username = "Curry";
    const email = "email@email.com";
    const password = "Awyd899?";
    const confirmPassword = "Awyd899?";
    let user: UserEvent;
    beforeEach(() => {
        user = userEvent.setup();
    })
    describe("SignUp Success",() => {
       it('When SignUp successfully,should redirect to Login Page', async() => {
        
           // Arrange
            renderWithProvider(
               renderWithQueryProvider(
                renderWithRouter(
                    <Routes>
                        <Route path="/signup" element={<SignUp/>} />
                        <Route path="/login" element={<Login/>}/>
                    </Routes>,
                    ["/signup"]
                )
             ),
             {
                preloadedState: {
                    auth: {
                        accessToken: "",
                        isPersistent: false
                    }
                }
             }
            )
           // Act
           const signupBtn = screen.getByRole("button",{ name: /create/i });
           const passwordField = screen.getByPlaceholderText("••••••••");
           const emailField = screen.getByPlaceholderText("name@company.com");
           const usernameField = screen.getByPlaceholderText("Enter your username");
           const confirmPasswordField = screen.getByPlaceholderText("Same as password");
           await user.type(usernameField,username);
           await user.type(emailField,email);
           await user.type(passwordField,password);
           await user.type(confirmPasswordField,confirmPassword);
           await user.click(signupBtn);
           // Assertion
           // Wait the Loading State
           await waitFor(() => {
              expect(screen.queryByRole("button",{ name: /loading/i })).not.toBeInTheDocument();
           })   
           await waitFor(() => {
               expect(screen.queryByRole("button",{ name: /create/i })).not.toBeInTheDocument();
           })
           expect(screen.getByRole("button",{ name: /login/i })).toBeInTheDocument();
       })
    })

    describe("SignUp Fail",() => {

        describe("Validation Error",() => {
            // Username Error
            it('When Username is empty,show the Error message under Username field', async() => {
                // Arrange
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const emailField = screen.getByPlaceholderText("name@company.com");
                const passwordField = screen.getByPlaceholderText("••••••••");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                await user.type(passwordField,password);
                await user.type(confirmPasswordField,confirmPassword);
                await user.type(emailField,email);
                await user.click(signupBtn);
                // Assertion
                const errorMsg = await screen.findByText(/username required/i);
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Username is less than two character,show the Error message under Username field', async() => {
                // Arrange
                const invalidUsername = "u";
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                await user.type(emailField,email);
                await user.type(passwordField,password);
                await user.type(confirmPasswordField,confirmPassword);
                await user.type(usernameField,invalidUsername);
                await user.click(signupBtn);
                // Assertion
                const errorMsg = await screen.findByText(/username at least/i);
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Username is over fifty character,show the Error message under Username field', async() => {
                // Arrange
                const invalidUsername = username+Array(10).fill("Many").join(",");
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                await user.type(emailField,email);
                await user.type(passwordField,password);
                await user.type(confirmPasswordField,confirmPassword);
                await user.type(usernameField,invalidUsername);
                await user.click(signupBtn);
                // Assertion
                const errorMsg = await screen.findByText(/username at most/i);
                expect(errorMsg).toBeInTheDocument();
            })
            // Email Error
            it('When Email is empty,show the Error message under Email field', async() => {
                // Arrange
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const passwordField = screen.getByPlaceholderText("••••••••");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                await user.type(passwordField,password);
                await user.type(confirmPasswordField,confirmPassword);
                await user.type(usernameField,username);
                await user.click(signupBtn);
                // Assertion
                const errorMsg = await screen.findByText(/email required/i);
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Email is invalid,show the Error message under Email field', async() => {
                // Arrange
                const invalidEmail = "invalidEmail";
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                await user.type(emailField,invalidEmail);
                await user.type(passwordField,password);
                await user.type(confirmPasswordField,confirmPassword);
                await user.type(usernameField,username);
                await user.click(signupBtn);
                // Assertion
                const errorMsg = await screen.findByText(/invalid email/i);
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Email is over fifty character,show the Error message under Email field', async() => {
                // Arrange
                const invalidEmail = email+Array(10).fill("Many").join(",");
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                await user.type(emailField,invalidEmail);
                await user.type(passwordField,password);
                await user.type(confirmPasswordField,confirmPassword);
                await user.type(usernameField,username);
                await user.click(signupBtn);
                // Assertion
                const errorMsg = await screen.findByText(/email at most/i);
                expect(errorMsg).toBeInTheDocument();
            })
            // Password or ConfirmPassword Error
            it('When Password and ConfirmPassword is empty,show the Error message under Password and ConfirmPassword field', async() => {
                // Arrange
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                // Act
                await user.type(emailField,email);
                await user.type(usernameField,username);
                await user.click(signupBtn);
                // Assertion
                const errorMsg = await screen.findByText("Password Required");
                const confirmErrorMsg = await screen.findByText(/confirmpassword required/i);
                expect(errorMsg).toBeInTheDocument();
                expect(confirmErrorMsg).toBeInTheDocument();
            })

            it('When Password and ConfirmPassword is invalid,show the Error message under Password and ConfirmPassword field', async() => {
                // Arrange
                const invalidPassword = "invalidPassword";
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/login"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                await user.type(emailField,email);
                await user.type(passwordField,invalidPassword);
                await user.type(confirmPasswordField,invalidPassword);
                await user.type(usernameField,username);
                await user.click(signupBtn);
                // Assertion
                const errorMsg = await screen.findByText("Password should include small and big letter and number and one special character");
                const confirmErrorMsg = await screen.findByText(/confirmpassword should include/i);
                expect(errorMsg).toBeInTheDocument();
                expect(confirmErrorMsg).toBeInTheDocument();
            })

            it('When Password and ConfirmPassword is over fifty character,show the Error message under Password and ConfirmPassword field', async() => {
                // Arrange
                const invalidPassword = password+Array(10).fill("Many").join(",");
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                await user.type(emailField,email);
                await user.type(passwordField,invalidPassword);
                await user.type(confirmPasswordField,invalidPassword);
                await user.type(usernameField,username);
                await user.click(signupBtn);
                // Assertion
                const errorMsg = await screen.findByText("Password at most fifty character");
                const confirmErrorMsg = await screen.findByText(/confirmpassword at most/i);
                expect(errorMsg).toBeInTheDocument();
                expect(confirmErrorMsg).toBeInTheDocument();
            })

            it('When Password and ConfirmPassword is less than eight character,show the Error message under Password and ConfirmPassword field', async() => {
                // Arrange
                const invalidPassword = "Asd67?";
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                await user.type(emailField,email);
                await user.type(passwordField,invalidPassword);
                await user.type(confirmPasswordField,invalidPassword);
                await user.type(usernameField,username);
                await user.click(signupBtn);
                // Assertion
                const errorMsg = await screen.findByText("Password at least eight character");
                const confirmErrorMsg = await screen.findByText(/confirmpassword at least/i);
                expect(errorMsg).toBeInTheDocument();
                expect(confirmErrorMsg).toBeInTheDocument();
            })

            it('When Password and ConfirmPassword is not same,show the Error message under ConfirmPassword field', async() => {
                // Arrange
                const invalidPassword = "Asd67gf?";
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                await user.type(emailField,email);
                await user.type(passwordField,password);
                await user.type(confirmPasswordField,invalidPassword);
                await user.type(usernameField,username);
                await user.click(signupBtn);
                // Assertion
                const confirmErrorMsg = await screen.findByText(/password not match/i);
                expect(confirmErrorMsg).toBeInTheDocument();
            })
        })

        describe("Client Error",() => {
            it('When Signup with exist username,username exist error message should show up', async() => {
                // Arrange
                const existUsername = "alreadyExist";
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                server.use(
                    http.post("http://localhost:3000/auth/signup",() => {
                        return HttpResponse.json({
                                state: "error",
                                error: {
                                    status: 400,
                                    detail: "Username already exist"
                                },
                                data: null,
                                meta: {
                                    timestamp: new Date().toISOString()
                                }
                         },{
                            status: 400
                         })
                    })
                )
                await user.type(emailField,email);
                await user.type(passwordField,password);
                await user.type(confirmPasswordField,confirmPassword);
                await user.type(usernameField,existUsername);
                await user.click(signupBtn);
                // Wait the Loading State
                await waitFor(() => {
                    expect(screen.queryByRole("button",{ name: /loading/i })).not.toBeInTheDocument();
                })
                // Assertion
                const errorMsg = screen.getByText("Username already exist");
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Signup with exist email,email exist error message should show up', async() => {
                // Arrange
                const existEmail = "exist@gmail.com";
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                server.use(
                    http.post("http://localhost:3000/auth/signup",() => {
                        return HttpResponse.json({
                                state: "error",
                                error: {
                                    status: 400,
                                    detail: "Email already exist"
                                },
                                data: null,
                                meta: {
                                    timestamp: new Date().toISOString()
                                }
                         },{
                            status: 400
                         })
                    })
                )
                await user.type(emailField,existEmail);
                await user.type(passwordField,password);
                await user.type(confirmPasswordField,confirmPassword);
                await user.type(usernameField,username);
                await user.click(signupBtn);
                // Wait the Loading State
                await waitFor(() => {
                    expect(screen.queryByRole("button",{ name: /loading/i })).not.toBeInTheDocument();
                })
                // Assertion
                const errorMsg = screen.getByText("Email already exist");
                expect(errorMsg).toBeInTheDocument();
            })
        })

        describe("Server Error",() => {

            it('When Server response with operation error,server error message should appear', async() => {
                // Arrange
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                server.use(
                    http.post("http://localhost:3000/auth/signup",() => {
                        return HttpResponse.json({
                                state: "error",
                                error: {
                                    status: 500,
                                    detail: "Server Error"
                                },
                                data: null,
                                meta: {
                                    timestamp: new Date().toISOString()
                                }
                         },{
                            status: 500
                         })
                    })
                )
                await user.type(emailField,email);
                await user.type(passwordField,password);
                await user.type(confirmPasswordField,confirmPassword);
                await user.type(usernameField,username);
                await user.click(signupBtn);
                // Wait the Loading State
                await waitFor(() => {
                    expect(screen.queryByRole("button",{ name: /loading/i })).not.toBeInTheDocument();
                })
                // Assertion
                const errorMsg = screen.getByText("Server Error");
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Network error occur,request fail message should appear', async() => {
                // Arrange
                render(
                    renderWithQueryProvider(
                        renderWithRouter(<SignUp/>,["/signup"])
                    )
                )
                const signupBtn = screen.getByRole("button",{ name: /create/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                const usernameField = screen.getByPlaceholderText("Enter your username");
                const confirmPasswordField = screen.getByPlaceholderText("Same as password");
                // Act
                server.use(
                    http.post("http://localhost:3000/auth/signup",() => {
                        return HttpResponse.error();
                    })
                )
                await user.type(emailField,email);
                await user.type(passwordField,password);
                await user.type(confirmPasswordField,confirmPassword);
                await user.type(usernameField,username);
                await user.click(signupBtn);
                // Wait the Loading State
                await waitFor(() => {
                    expect(screen.queryByRole("button",{ name: /loading/i })).not.toBeInTheDocument();
                })
                // Assertion
                const errorMsg = screen.getByText(/request fail/i);
                expect(errorMsg).toBeInTheDocument();
            })
        })
    })
})
