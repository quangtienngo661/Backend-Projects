const request = require('supertest');
const app = require('../../app')

describe('User Login', () => {
    test("POST /user/login - should login successfully", async () => {
        const res = await request(app)
            .post("/user/login")
            .send({
                email: "john.doe@example.com",
                password: "hashedPassword123"
            })

        expect(res.statusCode).toBe(200);  // Fix: toBe not tobe, and likely 200 not 201 for login
        expect(res.body).toHaveProperty("data");  // Based on your response helper structure
        expect(res.body.data).toHaveProperty("token");
    })

    test("POST /user/login - expecting wrong credentials", async () => {
        const res = await request(app)
            .post("/user/login")
            .send({
                email: "john.doe@example.com",
                password: "wrongCredentials"
            })

        expect(res.statusCode).toBe(401);  // Fix: toBe not tobe, and likely 200 not 201 for login
        expect(res.body).toHaveProperty("error");  // Based on your response helper structure
        expect(res.body.error).toHaveProperty("message");
        expect(res.body.error.message).toBe("Email or password is incorrect");
    })

    test("POST /user/login - missing required fields test", async () => {
        const res = await request(app)
            .post("/user/login")
            .send({
                password: "wrongCredentials"
            })

        expect(res.statusCode).toBe(400);  // Fix: toBe not tobe, and likely 200 not 201 for login
        expect(res.body).toHaveProperty("error");  // Based on your response helper structure
        expect(res.body.error).toHaveProperty("message");
        expect(res.body.error.message).toBe("Missing required fields");
    })
})