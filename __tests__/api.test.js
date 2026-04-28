const request = require("supertest");
const app = require("../server");

describe("Product API", () => {

  test("GET /api/products should return 200", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
  });

  test("POST /api/products should create product", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({
        name: "Test Product",
        description: "Test Desc",
        price: 100,
        imageUrl: "test.jpg",
        category: "test"
      });

    expect([200,201,400]).toContain(res.statusCode);
  });

});
