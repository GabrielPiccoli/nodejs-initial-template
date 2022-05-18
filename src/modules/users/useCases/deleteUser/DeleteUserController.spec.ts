import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("Delete User Controller", () => {
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

  it("should be able to delete a user", async () => {
    const responseToken = await request(app).post("/sessions").send({
      username: "admin",
      password: "admin",
    });
    const { token } = responseToken.body;
    const { body } = await request(app)
      .post("/users")
      .send({
        email: "test@test.com.br",
        name: "Gabriel Piccoli",
        password: "1234",
        username: "test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .delete(`/users/${body.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(204);
  });

  it("should be not able to delete a non exists user", async () => {
    const uuid = uuidV4();
    const responseToken = await request(app).post("/sessions").send({
      username: "admin",
      password: "admin",
    });
    const { token } = responseToken.body;
    const response = await request(app)
      .delete(`/users/${uuid}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
