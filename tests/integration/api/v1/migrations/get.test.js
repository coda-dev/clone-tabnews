import database from "infra/database";

beforeAll(limpaBaseDados); // roda isso antes de começar os testes
async function limpaBaseDados() {
  await database.query("drop schema public cascade; create schema public;");
}

test("get para api/v1/migrations retorna 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
