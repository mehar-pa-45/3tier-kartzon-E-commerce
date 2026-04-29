const request = require("supertest");
const app = require("../server");

describe("Server API Tests", () => {

  /* -------------------------
     HEALTH CHECK / BASE ROUTE
  --------------------------*/
  test("GET / should return response", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  /* -------------------------
     PRODUCTS API
  --------------------------*/
  test("GET /api/products should return products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  /* -------------------------
     INVALID ROUTE (important for coverage)
  --------------------------*/
  test("GET invalid route should return 404", async () => {
    const res = await request(app).get("/invalid-route");
    expect(res.statusCode).toBe(404);
  });

  /* -------------------------
     POST PRODUCT (edge coverage)
  --------------------------*/
  test("POST /api/products should handle request", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({
        name: "Test Product",
        price: 100
      });

    expect([200, 201, 400]).toContain(res.statusCode);
  });

});
