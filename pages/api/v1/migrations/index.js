import rodarMigrations from "node-pg-migrate";
import { resolve } from "node:path"; // trata o caminho do arquivo sitema operacional
import database from "infra/database";
//import { throws } from "node:assert";
import { createRouter } from "next-connect";
import controller from "infra/controller";
const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

const opcaoPadraoMigrataions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigraations",
};

async function getHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migrataionsPendentes = await rodarMigrations({
      ...opcaoPadraoMigrataions,
      dbClient,
    });
    return response.status(200).json(migrataionsPendentes);
  } finally {
    await dbClient?.end(); // tem que encerrar conexao depois rodar porque senao gera lock
  }
}

async function postHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migracoesMigrataions = await rodarMigrations({
      ...opcaoPadraoMigrataions,
      dbClient,
      dryRun: false,
    });

    if (migracoesMigrataions.length > 0) {
      return response.status(201).json(migracoesMigrataions); // 201 - altecao foi criada a migration
    }
    return response.status(200).json(migracoesMigrataions);
  } finally {
    await dbClient?.end(); // tem que encerrar conexao depois rodar porque senao gera lock
  }
}
