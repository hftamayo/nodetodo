const sinon = require("sinon");
const {signUpLimiter, loginLimiter} = require("../../src/api/middleware/rateLimiter");
const { request } = require("http");
const { expect } = require("chai");




describe("Rate Limiter Register Endpoint Unit Test", () => {
    describe("signUpLimiter under dev environment", () => {
        it("Should allow 10000 requests under 24 hours", () => {
            for (let i = 0; i < 10000; i++) {
                const res = await request(app).post("/register");
                expect(res.statusCode).to.equal(200);
            }
        });
    });
});