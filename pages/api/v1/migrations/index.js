import rodarMigrations from "node-pg-migrate";
import { join } from "node:path"; // trata o caminho do arquivo sitema operacional
import database from "infra/database";

export default async function migrataions(request, response) {
  const dbClient = await database.getNewClient();

  const opcaoPadraoMigrataions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigraations",
  };

  if (request.method === "GET") {
    const migrataionsPendentes = await rodarMigrations(opcaoPadraoMigrataions);
    await dbClient.end(); // tem que encerrar conexao depois rodar porque senao gera lock
    return response.status(200).json(migrataionsPendentes);
  }

  if (request.method === "POST") {
    const migracoesMigrataions = await rodarMigrations({
      ...opcaoPadraoMigrataions,
      dryRun: false,
    });

    await dbClient.end(); // tem que encerrar conexao depois rodar porque senao gera lock

    if (migracoesMigrataions.length > 0) {
      return response.status(201).json(migracoesMigrataions); // 201 - altecao foi criada a migration
    }
    return response.status(200).json(migracoesMigrataions);
  }

  return response.status(405).end(); // 405 - significa não acho o methodos acima
}
