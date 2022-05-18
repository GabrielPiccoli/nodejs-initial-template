import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("Refresh User Token Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO users(id, name, email, username, password)
      VALUES('${id}', 'Gabriel Piccoli', 'gabriel.pdmarcos@gmail.com', 'admin', '${password}')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to refresh a user token send by json", async () => {
    const responseToken = await request(app).post("/sessions").send({
      username: "admin",
      password: "admin",
    });
    const { refresh_token } = responseToken.body;

    const response = await request(app).post("/refresh-token").send({
      token: refresh_token,
    });

    expect(response.body).toHaveProperty("token");
  });

  it("should be able to refresh a user token send by authorization", async () => {
    const responseToken = await request(app).post("/sessions").send({
      username: "admin",
      password: "admin",
    });
    const { refresh_token } = responseToken.body;

    const response = await request(app)
      .post("/refresh-token")
      .set("x-access-token", refresh_token);

    expect(response.body).toHaveProperty("token");
  });

  it("should be able to refresh a user token send by query string", async () => {
    const responseToken = await request(app).post("/sessions").send({
      username: "admin",
      password: "admin",
    });
    const { refresh_token } = responseToken.body;

    const response = await request(app).post(
      `/refresh-token?token=${refresh_token}`
    );

    expect(response.body).toHaveProperty("token");
  });
});
