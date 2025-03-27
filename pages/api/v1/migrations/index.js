import rodarMigrations from "node-pg-migrate";
import { resolve } from "node:path"; // trata o caminho do arquivo sitema operacional
import database from "infra/database";
import { throws } from "node:assert";

export default async function migrataions(request, response) {
  const allowedMethod = ["GET", "POST"];
  if (!allowedMethod.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    }); // 405 - significa não acho o methodos acima
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const opcaoPadraoMigrataions = {
      dbClient: dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigraations",
    };

    if (request.method === "GET") {
      const migrataionsPendentes = await rodarMigrations(
        opcaoPadraoMigrataions,
      );
      return response.status(200).json(migrataionsPendentes);
    }

    if (request.method === "POST") {
      const migracoesMigrataions = await rodarMigrations({
        ...opcaoPadraoMigrataions,
        dryRun: false,
      });

      if (migracoesMigrataions.length > 0) {
        return response.status(201).json(migracoesMigrataions); // 201 - altecao foi criada a migration
      }
      return response.status(200).json(migracoesMigrataions);
    }
  } catch (error) {
    console.error(error);
    throws.throw(() => {
      throw error;
    });
  } finally {
    await dbClient.end(); // tem que encerrar conexao depois rodar porque senao gera lock
  }
}
