import { version } from "../../package.json";
import request from "supertest";
import app from "../../src/app";

it("Should be same version", async () => {
  const v = await request(app).get("/").send();
  expect(v.body.version).toBe(version);
});
