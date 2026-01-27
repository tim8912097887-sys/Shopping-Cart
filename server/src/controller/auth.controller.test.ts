import request from "supertest";
import { app } from "../app.js";
import mongoose from "mongoose";
import { env } from "../config/env.config.js";
import { UserModel } from "../model/user.model.js";
import { CreateUserType } from "../schema/creatUser.schema.js";
import { ApiError, ErrorCode, ErrorType } from "../custom/ApiError.js";
import { jest } from '@jest/globals';

// Factory function
const createUser = (username: string,password: string): CreateUserType => {
     return {
        username,
        email: `${username}@email.com`,
        password,
        confirmPassword: password
     }
}

describe("Auth Integration Test",() => {
    const UserStructure = {
        _id: expect.any(String),
        username: expect.any(String),
        email: expect.any(String),
        isAdmin: expect.any(Boolean)
    }
    // Database setup and teardown
    beforeAll(async() => {
        await mongoose.connect(env.MONGO_URI);
    },10000)
    afterAll(async() => {
        await mongoose.connection.close();
    },10000)
    // Implement test isolation by cleanup after each test
    afterEach(async() => {
        await UserModel.deleteMany({});
    },10000)

    describe("Signup User",() => {
       
       it('When provide valid data,should response with 201 statusCode and Created User', async() => {
           // Arrange
           const mockUser = createUser("kd","Qwe1267?"); 
           // Act
           const response = await request(app)
                            .post("/auth/signup")
                            .send(mockUser);
            // Assertion
            expect(response.status).toBe(201);
            expect(response.body.error).toBeNull();
            expect(response.body.data.user).toMatchObject(UserStructure); 
            // Should hide the password
            expect(response.body.data.user.password).toBeUndefined(); 
          })

       it('When provide Uppercase data,should response with 201 statusCode and Lowercase Created User', async() => {
           // Arrange
           const uppercaseUser = createUser("KD","Qwe1267?");
           // Act
           const response = await request(app)
                            .post("/auth/signup")
                            .send(uppercaseUser);
            // Assertion
            expect(response.status).toBe(201);
            expect(response.body.error).toBeNull();
            expect(response.body.data.user.username).toBe("kd");  
          })

       it('When Password Not equal ConfirmPassword,should response with 400 statusCode and Bad Request Error', async() => {
           // Arrange
           const invalidUser = createUser("kd","Qwe1267?");
           invalidUser.confirmPassword = "Qwe1267!";
           // Act
           const response = await request(app)
                            .post("/auth/signup")
                            .send(invalidUser);
            // Assertion
            expect(response.status).toBe(400);
            expect(response.body.data).toBeNull();
            expect(response.body.error).toMatchObject({
                status: 400,
                detail: /should match/i
            });
          })

          it('When provide Invalid Email,should response with 400 statusCode and Bad Request Error', async() => {
            // Arrange
            const invalidUser = createUser("kd","Qwe1267?");
            invalidUser.email = "invalid@email";
            // Act
            const response = await request(app)
                                .post("/auth/signup")
                                .send(invalidUser);
                // Assertion
                expect(response.status).toBe(400);
                expect(response.body.data).toBeNull();
                expect(response.body.error).toMatchObject({
                    status: 400,
                    detail: /invalid email/i
            });
          })

          it('When provide Duplicate username,should response with 409 statusCode and Server Conflict Error', async() => {
           // Arrange
           const mockUser = createUser("kd","Qwe1267?");
           // Create same user for duplicate
           await UserModel.create(mockUser);
           // Act
           const response = await request(app)
                            .post("/auth/signup")
                            .send(mockUser);
            // Assertion
            expect(response.status).toBe(409);
            expect(response.body.data).toBeNull();
            // Should hide the password
            expect(response.body.error).toMatchObject({
                status: 409,
                detail: /already exists/i
            });
          })

          it('When Server Fail,should response with 500 Server Error', async() => {
            
            // Arrange
            const modelSpy = jest.spyOn(UserModel,"create")
                                 .mockImplementationOnce(() => {
                                    throw new ApiError(ErrorType.SERVER_ERROR,ErrorCode.SERVER_ERROR,"Server Error",true);
                                 })
            const mockUser = createUser("kd","Qwe1267?");
            // Act
            const response = await request(app)
                                .post("/auth/signup")
                                .send(mockUser);
            // Assertion
                expect(response.statusCode).toBe(500);
                expect(response.body.data).toBeNull();
                expect(response.body.error).toMatchObject({
                    status: 500,
                    detail: /server error/i
                });
            // Restore the functionality
            modelSpy.mockRestore();
          })

        })

        describe("Login User",() => {
            const mockUser = createUser("kd","Qwe1267?");
            // Create user for login
            beforeEach(async() => {
                     
                      // Directly create enhance speed
                      await UserModel.create(mockUser);
            },10000)

            it('When provide valid data,should response with 200 statusCode and Login User and accessToken', async() => {
                // Act
                const response = await request(app)
                                       .post("/auth/login")
                                       .send(mockUser)
                // Assertion
                expect(response.status).toBe(200);
                expect(response.body.error).toBeNull();
                // Should hide the password
                expect(response.body.data.user.password).toBeUndefined();
                expect(response.body.data.user).toMatchObject(UserStructure);
                expect(typeof response.body.data.accessToken).toBe("string");
            })

            it('When provide username contain space on side,should response with 200 statusCode and Login User and accessToken', async() => {
                // Arrange
                const spaceUser = createUser("kd","Qwe1267?");
                spaceUser.username = " kd"
                // Act
                const response = await request(app)
                                       .post("/auth/login")
                                       .send(spaceUser)
                // Assertion
                expect(response.status).toBe(200);
                expect(response.body.error).toBeNull();
                expect(response.body.data.user).toMatchObject(UserStructure);
                expect(typeof response.body.data.accessToken).toBe("string");
            })

            it('When provide Invalid Password,should response with 400 statusCode and Bad Request Error', async() => {
                // Arrange
                const invalidUser = createUser("kd","Qwe1267?");
                invalidUser.password = "Qwe11267"; 
                // Act
                const response = await request(app)
                                       .post("/auth/login")
                                       .send(invalidUser)
                // Assertion
                expect(response.status).toBe(400);
                expect(response.body.data).toBeNull();
                expect(response.body.error).toMatchObject({
                    status: 400,
                    detail: /should include/i
                });
            })

            it('When provide Not Exist email,should response with 400 statusCode and Bad Request Error', async() => {
                // Arrange
                const notExistUser = createUser("notExistUser","Qwe1267?");
                // Act
                const response = await request(app)
                                       .post("/auth/login")
                                       .send(notExistUser)
                // Assertion
                expect(response.status).toBe(400);
                expect(response.body.data).toBeNull();
                expect(response.body.error).toMatchObject({
                    status: 400,
                    detail: /email or password/i
                });
            })

            it('When provide Exist email but not correct password,should response with 400 statusCode and Bad Request Error', async() => {
                // Arrange
                const notExistUser = createUser("kd","Qwe1267!");
                // Act
                const response = await request(app)
                                       .post("/auth/login")
                                       .send(notExistUser)
                // Assertion
                expect(response.status).toBe(400);
                expect(response.body.data).toBeNull();
                expect(response.body.error).toMatchObject({
                    status: 400,
                    detail: /email or password/i
                });
            })

            it('When Fail Login three time with Same Email,should response with 403 statusCode and Forbidden Error', async() => {
                // Arrange
                const notExistUser = createUser("kd","Qwe1267!");
                // Modified login time to three and trigger the lock account error
                const result = await UserModel.updateOne({ email: notExistUser.email },{ loginAttempts: 3,loginUtils: Date.now()+Number(env.ACCOUNT_LOCK_TIME) });
                expect(result.modifiedCount).toBe(1);
                // Act
                const response = await request(app)
                                .post("/auth/login")
                                .send(notExistUser)
                // Assertion
                expect(response.status).toBe(403);
                expect(response.body.data).toBeNull();
                expect(response.body.error).toMatchObject({
                     status: 403,
                     detail: /is locked/i
                });
            })

            it('When Fail to Login with Same email two time and Success at third time,should response with 200 statusCode and Cleared User data', async() => {
                // Arrange
                // Modified login time to two
                const result = await UserModel.updateOne({ email: mockUser.email },{ loginAttempts: 2 });
                expect(result.modifiedCount).toBe(1);
                // Act
                const response = await request(app)
                                .post("/auth/login")
                                .send(mockUser)
                // Assertion
                expect(response.status).toBe(200);
                expect(response.body.error).toBeNull();
                // Should reset the state
                expect(response.body.data.user.loginAttempts).toBe(0);
                expect(response.body.data.user.loginUtils).toBe(-1);
            })

            it('When Server Fail,should response with 500 statusCode and Server Error', async() => {
                // Arrange
                const modelSpy = jest.spyOn(UserModel,"findOne")
                                     .mockImplementationOnce(() => {
                                        throw new ApiError(ErrorType.SERVER_ERROR,ErrorCode.SERVER_ERROR,"Server Error",true);
                                     })
                // Act
                const response = await request(app)
                                .post("/auth/login")
                                .send(mockUser);
                // Assertion
                expect(response.statusCode).toBe(500);
                expect(response.body.data).toBeNull();
                expect(response.body.error).toMatchObject({
                    status: 500,
                    detail: /server error/i
                });
                // Restore to functionality
                modelSpy.mockRestore();
            })
        })

        describe("Logout User",() => {

            it('When Success,should response with 200 statusCode', async() => {
                // Act
                const response = await request(app)
                                       .delete("/auth/logout");
                // Assert
                expect(response.status).toBe(200);
                expect(response.body.error).toBeNull();
                expect(response.body.state).toMatch("success");
            })

            it('When Server fail,should response with 500 statusCode and Server Error', async() => {
                // Arrange
                const cookieSpy = jest.spyOn(app.response,'clearCookie')
                                      .mockImplementationOnce(() => {
                                        throw new ApiError(ErrorType.SERVER_ERROR,ErrorCode.SERVER_ERROR,"Server Error",true);
                                      })
                // Act
                const response = await request(app)
                                       .delete("/auth/logout");
                // Assert
                expect(response.status).toBe(500);
                expect(response.body.data).toBeNull();
                expect(response.body.error).toMatchObject({
                    status: 500,
                    detail: /server error/i
                });
                // Restore the original functionality
                cookieSpy.mockRestore();
            })

        })

        describe("Refresh User",() => {

            it('When visit without Refresh Token in cookie,should response with 401 statusCode and Unauthorized Error', async() => {
                // Act
                const response = await request(app)
                                       .get("/auth/refresh");
                // Assertion
                expect(response.statusCode).toBe(401);
                expect(response.body.data).toBeNull();
                expect(response.body.error).toMatchObject({
                    status: 401,
                    detail: /unauthentication/i
                });
            })

            it('When Successfully refresh token,should response with 200 statusCode and New AccessToken', async() => {
                // Arrange
                // Create user for login
                const user = createUser("kd","Qwe1267?");
                await UserModel.create(user);
                const loginRes = await request(app)
                                            .post("/auth/login")
                                            .send(user)
                const cookie = loginRes.header['set-cookie'];

                // Act
                const response = await request(app)
                                       .get("/auth/refresh")
                                       .set('Cookie',cookie);
                // Assertion
                expect(response.statusCode).toBe(200);
                expect(response.body.error).toBeNull();
                expect(typeof response.body.data.accessToken).toBe("string");
            })

            it('When server Fail,should response with 500 statusCode and Server Error', async() => {
                // Arrange
                // Create user for login
                const user = createUser("kd","Qwe1267?");
                await UserModel.create(user);
                const loginRes = await request(app)
                                            .post("/auth/login")
                                            .send(user)
                const cookie = loginRes.header['set-cookie'];
                const cookieSpy = jest.spyOn(app.response,"cookie")
                                      .mockImplementationOnce(() => {
                                        throw new ApiError(ErrorType.SERVER_ERROR,ErrorCode.SERVER_ERROR,"Server Error",true);
                                      })
                // Act
                const response = await request(app)
                                       .get("/auth/refresh")
                                       .set('Cookie',cookie);
                // Assertion
                expect(response.statusCode).toBe(500);
                expect(response.body.data).toBeNull();
                expect(response.body.error).toMatchObject({
                    status: 500,
                    detail: /server error/i
                });
                // Restore to original cookie
                cookieSpy.mockRestore();
            })
        })
})