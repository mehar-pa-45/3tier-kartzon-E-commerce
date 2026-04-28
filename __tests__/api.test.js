const request = require("supertest");
const app = require("../server");

describe("Product API", () => {

  test("GET products", async () => {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

});
