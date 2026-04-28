const request = require("supertest");
const app = require("../server");

describe("Product API Tests", () => {

  test("GET / should return API Running", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("API Running");
  });

  test("GET products should return product list", async () => {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("Invalid route should return 404", async () => {
    const res = await request(app).get("/wrongroute");
    expect(res.statusCode).toBe(404);
  });

});
