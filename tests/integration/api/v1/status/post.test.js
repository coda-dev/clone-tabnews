/*import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});
*/
describe("post api/v1/status", () => {
  describe("Usuario anonimo", () => {
    test("Obtendo status atual sistema", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status", {
        method: "POST",
      });
      expect(response.status).toBe(405); // 405 - METODO NAO ENCONTRADO

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "MethodNotAllowdedError",
        message: "Método não permitido para este endpoint.",
        action: "Método HTTP para endpoint não é válido.",
        status_code: 405,
      });
    });
  });
});
