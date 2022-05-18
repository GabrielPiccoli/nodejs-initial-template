import { hash } from "bcryptjs";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;

describe("Update User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, username)
      VALUES('${id}', 'Gabriel Piccoli', 'gabriel.pdmarcos@gmail.com', '${password}', 'admin')
      `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to update a user", async () => {
    const responseToken = await request(app).post("/sessions").send({
      username: "admin",
      password: "admin",
    });
    const { token } = responseToken.body;

    const { body } = await request(app)
      .post("/users")
      .send({
        email: "gabriel.pdmarcos@test.com",
        name: "Gabriel Piccoli",
        password: "@@123abc",
        username: "test",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .put(`/users/${body.id}`)
      .send({
        email: "gabriel.pdmarcos@test.com.br",
        name: "Gabriel Piccoli Updated",
        password: "@@123abc",
        username: "test",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.body.name).toEqual("Gabriel Piccoli Updated");
  });

  it("should not be able to update a non exists user", async () => {
    const responseToken = await request(app).post("/sessions").send({
      username: "admin",
      password: "admin",
    });
    const { token } = responseToken.body;
    const uuid = uuidV4();

    const response = await request(app)
      .put(`/users/${uuid}`)
      .send({
        email: "gabriel.pdmarcos@test.com.br",
        name: "Gabriel Piccoli Updated",
        password: "@@123abc",
        username: "test",
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
  });
});
