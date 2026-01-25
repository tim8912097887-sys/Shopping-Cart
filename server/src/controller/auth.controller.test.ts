import request from "supertest";
import { app } from "../app.js";
import mongoose from "mongoose";
import { env } from "../config/env.config.js";
import { UserModel } from "../model/user.model.js";

describe("Auth Integration Test",() => {

    // Connect database before all test
    beforeAll(async() => {
        await mongoose.connect(env.MONGO_URI);
    })
    // Disconnect database after all test
    afterAll(async() => {
        await mongoose.connection.close();
    })
    // Implement test isolation by cleanup after test
    beforeEach(async() => {
        await UserModel.deleteMany({});
    })
    // afterEach(async() => {

    // })
    describe("Signup User",() => {
       
       it('When provide valid data to signup route,should response with 201 statusCode and Created User', async() => {
           const response = await request(app)
                            .post("/auth/signup")
                            .send({
                                username: "kd",
                                email: "kd@email.com",
                                password: "Qwe1267?",
                                confirmPassword: "Qwe1267?"
                            });
            expect(response.status).toBe(201);
            })
        })

})