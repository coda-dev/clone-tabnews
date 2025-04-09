import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPedingMigrations();
});

describe("get api/v1/users/[username]", () => {
  describe("Usuario anonimo", () => {
    test("Com username exato verificando case-sensitive", async () => {
      const responseExatoCaseSensitive1 = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({
            username: "MesmoCase",
            email: "mesmo.case@gmail.com",
            password: "senha123",
          }),
        },
      );

      expect(responseExatoCaseSensitive1.status).toBe(201); // 201 - usuario criado

      const responseExatoCaseSensitive2 = await fetch(
        "http://localhost:3000/api/v1/users/MesmoCase",
      );

      expect(responseExatoCaseSensitive2.status).toBe(200); // requisicao valida MesmoCaseSensitive

      const responseExatoCaseSensitive2Body =
        await responseExatoCaseSensitive2.json();

      expect(responseExatoCaseSensitive2Body).toEqual({
        id: responseExatoCaseSensitive2Body.id,
        username: "MesmoCase",
        email: "mesmo.case@gmail.com",
        password: "senha123",
        created_at: responseExatoCaseSensitive2Body.created_at,
        updated_at: responseExatoCaseSensitive2Body.updated_at,
      });

      expect(uuidVersion(responseExatoCaseSensitive2Body.id)).toBe(4);
      expect(
        Date.parse(responseExatoCaseSensitive2Body.created_at),
      ).not.toBeNaN();
      expect(
        Date.parse(responseExatoCaseSensitive2Body.updated_at),
      ).not.toBeNaN();
    });

    test("Com username verificando sem case-sensitive", async () => {
      const responseExatoCaseSensitive1 = await fetch(
        "http://localhost:3000/api/v1/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({
            username: "CaseDiferente",
            email: "case.diferente@gmail.com",
            password: "senha123",
          }),
        },
      );

      expect(responseExatoCaseSensitive1.status).toBe(201); // 201 - usuario criado

      const responseExatoCaseSensitive2 = await fetch(
        "http://localhost:3000/api/v1/users/casediferente",
      );

      expect(responseExatoCaseSensitive2.status).toBe(200); // requisicao valida MesmoCaseSensitive

      const responseExatoCaseSensitive2Body =
        await responseExatoCaseSensitive2.json();

      expect(responseExatoCaseSensitive2Body).toEqual({
        id: responseExatoCaseSensitive2Body.id,
        username: "CaseDiferente",
        email: "case.diferente@gmail.com",
        password: "senha123",
        created_at: responseExatoCaseSensitive2Body.created_at,
        updated_at: responseExatoCaseSensitive2Body.updated_at,
      });

      expect(uuidVersion(responseExatoCaseSensitive2Body.id)).toBe(4);
      expect(
        Date.parse(responseExatoCaseSensitive2Body.created_at),
      ).not.toBeNaN();
      expect(
        Date.parse(responseExatoCaseSensitive2Body.updated_at),
      ).not.toBeNaN();
    });

    test("Com username não existente", async () => {
      const responseUsuarioInexistente = await fetch(
        "http://localhost:3000/api/v1/users/UsuarioInexistente",
      );

      expect(responseUsuarioInexistente.status).toBe(404); // requisicao não encontrou usuario inexistente

      const responseUsuarioInexistenteBody =
        await responseUsuarioInexistente.json();

      expect(responseUsuarioInexistenteBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
