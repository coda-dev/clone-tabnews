import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPedingMigrations();
});

describe("post api/v1/users", () => {
  describe("Usuario anonimo", () => {
    test("Com dados unico e valido", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          username: "1UsuTest",
          email: "teste@gmail.com",
          password: "senha123",
        }),
      });

      expect(response.status).toBe(201); // 201 - usuario criado

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "1UsuTest",
        email: "teste@gmail.com",
        password: "senha123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("Com 'email' duplicado", async () => {
      const responseEmail1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          username: "duplicado1",
          email: "duplicado@gmail.com",
          password: "senha123",
        }),
      });

      expect(responseEmail1.status).toBe(201); // 201 - usuario criado

      const responseEmail2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          username: "duplicado2",
          email: "Duplicado@gmail.com",
          password: "senha123",
        }),
      });

      expect(responseEmail2.status).toBe(400); // requisicao invalida (409 - conflito | 422 - entidade não processada)

      const responseEmail2Body = await responseEmail2.json();
      expect(responseEmail2Body).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para autorizar o cadastro.",
        status_code: 400,
      });
    });

    test("Com 'username' duplicado", async () => {
      const responseUsername1 = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({
            username: "duplicado",
            email: "d@gmail.com",
            password: "senha123",
          }),
        },
      );

      expect(responseUsername1.status).toBe(201); // 201 - usuario criado

      const responseUsername2 = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({
            username: "duplicado",
            email: "D2@gmail.com",
            password: "senha123",
          }),
        },
      );

      expect(responseUsername2.status).toBe(400); // requisicao invalida (409 - conflito | 422 - entidade não processada)

      const responseUsername2Body = await responseUsername2.json();
      expect(responseUsername2Body).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para autorizar o cadastro.",
        status_code: 400,
      });
    });
  });
});
