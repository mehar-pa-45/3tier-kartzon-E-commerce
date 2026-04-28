const request = require("supertest");
const app = require("../server");

describe("Product API", () => {

  test("GET products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
  });

  test("Create product validation", async () => {
    const res = await request(app)
      .post("/api/products")
      .send({});

    expect(res.statusCode).toBe(400);
  });

});
