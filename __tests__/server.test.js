const request = require("supertest");
const app = require("../server");

describe("API Test", () => {

  test("Server should respond 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

});
