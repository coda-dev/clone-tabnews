import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("get para api/v1/status retorna 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.update_at).toBeDefined(); // define se esta declarada

  const parseUpdateAt = new Date(responseBody.update_at).toISOString();
  expect(responseBody.update_at).toEqual(parseUpdateAt);

  const version = responseBody.dependencies.database.version;
  expect(responseBody.dependencies.database.version).toBeDefined();
  expect(responseBody.dependencies.database.version).toEqual("16.6");
  console.log(version);

  const max_connections = responseBody.dependencies.database.max_connections;
  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  console.log(max_connections);

  const opened_connections =
    responseBody.dependencies.database.opened_connections;
  expect(responseBody.dependencies.database.opened_connections).toBeDefined();
  expect(responseBody.dependencies.database.opened_connections).toEqual(1); //opened_connections);
  console.log(opened_connections);
});
