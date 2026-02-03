import { renderWithProvider } from "@/test/renderWithProvider";
import { renderWithQueryProvider } from "@/test/renderWithQueryProvider";
import { renderWithRouter } from "@/test/renderWithRouter";
import { screen, waitFor } from "@testing-library/react";
import { userEvent, type UserEvent } from "@testing-library/user-event"
import Login from "./Login";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Header from "@/components/Header";
import AuthProtect from "@/components/AuthProtect";
import Cart from "./Cart";
import { server } from "@/test/setup";
import { http, HttpResponse } from "msw";

describe("Login Integration Test",() => {

    const email = "email@email.com";
    const password = "Awyd899?";
    let user: UserEvent;
    beforeEach(() => {
        user = userEvent.setup();
    })
    describe("Login Success",() => {
       
        it('When Login successfully,should redirct to home page', async() => {
            // Arrange
                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(
                            <Routes>
                                <Route path="/login" element={<Login/>} />
                                <Route path="/" element={<Home/>}/>
                            </Routes>
                            ,["/login"])
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
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                // Act
                await user.type(emailField,email);
                await user.type(passwordField,password);
                await user.click(loginBtn);
                // Assertion
                // Wait for Loading State
                await waitFor(() => {
                    expect(screen.queryByRole("button",{ name: /loading/i })).not.toBeInTheDocument();
                })
                expect(screen.getByText(/home/i)).toBeInTheDocument();
        })

        it('When Login successfully,should be able to navigate to Protected Page like Cart', async() => {
            // Arrange
                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(
                            <>
                                <Header/>
                                <Routes>
                                    <Route path="/login" element={<Login/>} />
                                    <Route path="/" element={<Home/>}/>
                                    <Route element={<AuthProtect/>}>
                                      <Route path="/cart" element={<Cart/>} />
                                    </Route>
                                </Routes>
                            </>
                            ,["/login"])
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
                const cartLink = screen.getByTestId("cart_link");
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                // Act
                await user.type(emailField,email);
                await user.type(passwordField,password);
                await user.click(loginBtn);
                // Wait for Loading State
                await waitFor(() => {
                    expect(screen.queryByRole("button",{ name: /loading/i })).not.toBeInTheDocument();
                })
                expect(screen.getByText(/home/i)).toBeInTheDocument();
                await user.click(cartLink);
                // Assertion
                expect(screen.getByText(/cart/i)).toBeInTheDocument();
        }) 
                
    })

    describe("Login Fail",() => {

        describe("Validation Error",() => {

            it('When Email is empty,show the Error message under Email field', async() => {
                // Arrange

                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(<Login/>,["/login"])
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
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                // Act
                await user.type(passwordField,password);
                await user.click(loginBtn);
                // Assertion
                const errorMsg = await screen.findByText(/email required/i);
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Email is invalid,show the Error message under Email field', async() => {
                // Arrange
                const invalidEmail = "invalidEmail";
                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(<Login/>,["/login"])
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
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                // Act
                await user.type(emailField,invalidEmail);
                await user.type(passwordField,password);
                await user.click(loginBtn);
                // Assertion
                const errorMsg = await screen.findByText(/invalid email/i);
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Email is over fifty character,show the Error message under Email field', async() => {
                // Arrange
                const invalidEmail = email+Array(10).fill("Many").join(",");
                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(<Login/>,["/login"])
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
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                // Act
                await user.type(emailField,invalidEmail);
                await user.type(passwordField,password);
                await user.click(loginBtn);
                // Assertion
                const errorMsg = await screen.findByText(/email at most/i);
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Password is empty,show the Error message under Password field', async() => {
                // Arrange

                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(<Login/>,["/login"])
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
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const emailField = screen.getByPlaceholderText("name@company.com");
                // Act
                await user.type(emailField,email);
                await user.click(loginBtn);
                // Assertion
                const errorMsg = await screen.findByText(/password required/i);
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Password is invalid,show the Error message under Password field', async() => {
                // Arrange
                const invalidPassword = "invalidPassword";
                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(<Login/>,["/login"])
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
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                // Act
                await user.type(emailField,email);
                await user.type(passwordField,invalidPassword);
                await user.click(loginBtn);
                // Assertion
                const errorMsg = await screen.findByText(/password should include/i);
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Password is over fifty character,show the Error message under Password field', async() => {
                // Arrange
                const invalidPassword = password+Array(10).fill("Many").join(",");
                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(<Login/>,["/login"])
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
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                // Act
                await user.type(emailField,email);
                await user.type(passwordField,invalidPassword);
                await user.click(loginBtn);
                // Assertion
                const errorMsg = await screen.findByText(/password at most/i);
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Password is less than eight character,show the Error message under Password field', async() => {
                // Arrange
                const invalidPassword = "Asd67?";
                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(<Login/>,["/login"])
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
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                // Act
                await user.type(emailField,email);
                await user.type(passwordField,invalidPassword);
                await user.click(loginBtn);
                // Assertion
                const errorMsg = await screen.findByText(/password at least/i);
                expect(errorMsg).toBeInTheDocument();
            })
        })

        describe("Client Error",() => {

            it('When Login with not register Email,email or password incorrect message should show up', async() => {
                // Arrange
                const notExistEmail = "notexist@gmail.com"
                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(
                            <Routes>
                                <Route path="/login" element={<Login/>} />
                            </Routes>
                            ,["/login"])
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
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                // Act
                server.use(
                    http.post("http://localhost:3000/auth/login",() => {
                         return HttpResponse.json({
                                state: "error",
                                error: {
                                    status: 409,
                                    detail: "Email or Password is not correct"
                                },
                                data: null,
                                meta: {
                                    timestamp: new Date().toISOString()
                                }
                         },{
                            status: 409
                         })
                    })
                )
                await user.type(emailField,notExistEmail);
                await user.type(passwordField,password);
                await user.click(loginBtn);
                // Wait for Loading State
                await waitFor(() => {
                    expect(screen.queryByRole("button",{ name: /loading/i })).not.toBeInTheDocument();
                })
                const errorMsg = screen.getByText(/email or password is not correct/i);
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Login with incorrect Password,email or password incorrect message should show up', async() => {
                // Arrange
                const incorrectPassword = "Ads902?j";
                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(
                            <Routes>
                                <Route path="/login" element={<Login/>} />
                            </Routes>
                            ,["/login"])
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
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                // Act
                server.use(
                    http.post("http://localhost:3000/auth/login",() => {
                         return HttpResponse.json({
                                state: "error",
                                error: {
                                    status: 409,
                                    detail: "Email or Password is not correct"
                                },
                                data: null,
                                meta: {
                                    timestamp: new Date().toISOString()
                                }
                         },{
                            status: 409
                         })
                    })
                )
                await user.type(emailField,email);
                await user.type(passwordField,incorrectPassword);
                await user.click(loginBtn);
                // Wait for Loading State
                await waitFor(() => {
                    expect(screen.queryByRole("button",{ name: /loading/i })).not.toBeInTheDocument();
                })
                const errorMsg = screen.getByText(/email or password is not correct/i);
                expect(errorMsg).toBeInTheDocument();
            })
        })

        describe("Server Error",() => {
            
            it('When Server response with operation error,server error message should appear', async() => {
                // Arrange
                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(
                            <Routes>
                                <Route path="/login" element={<Login/>} />
                            </Routes>
                            ,["/login"])
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
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                // Act
                server.use(
                    http.post("http://localhost:3000/auth/login",() => {
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
                await user.click(loginBtn);
                // Wait for Loading State
                await waitFor(() => {
                    expect(screen.queryByRole("button",{ name: /loading/i })).not.toBeInTheDocument();
                })
                const errorMsg = screen.getByText("Server Error");
                expect(errorMsg).toBeInTheDocument();
            })

            it('When Network error occur,request fail message should appear', async() => {
                // Arrange
                renderWithProvider(
                    renderWithQueryProvider(
                        renderWithRouter(
                            <Routes>
                                <Route path="/login" element={<Login/>} />
                            </Routes>
                            ,["/login"])
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
                const loginBtn = screen.getByRole("button",{ name: /login/i });
                const passwordField = screen.getByPlaceholderText("••••••••");
                const emailField = screen.getByPlaceholderText("name@company.com");
                // Act
                server.use(
                    http.post("http://localhost:3000/auth/login",() => {
                         return HttpResponse.error();
                    })
                )
                await user.type(emailField,email);
                await user.type(passwordField,password);
                await user.click(loginBtn);
                // Wait for Loading State
                await waitFor(() => {
                    expect(screen.queryByRole("button",{ name: /loading/i })).not.toBeInTheDocument();
                })
                const errorMsg = screen.getByText(/request fail/i);
                expect(errorMsg).toBeInTheDocument();
            })
        })
    })
})