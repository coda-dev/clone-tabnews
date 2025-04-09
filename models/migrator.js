import rodarMigrations from "node-pg-migrate";
import { resolve } from "node:path"; // trata o caminho do arquivo sitema operacional
import database from "infra/database.js";
//import { throws } from "node:assert";

const opcaoPadraoMigrataions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  log: () => {},
  migrationsTable: "pgmigraations",
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migrataionsPendentes = await rodarMigrations({
      ...opcaoPadraoMigrataions,
      dbClient,
    });
    return migrataionsPendentes;
  } finally {
    await dbClient?.end(); // tem que encerrar conexao depois rodar porque senao gera lock
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migracoesMigradas = await rodarMigrations({
      ...opcaoPadraoMigrataions,
      dbClient,
      dryRun: false,
    });

    return migracoesMigradas;
  } finally {
    await dbClient?.end(); // tem que encerrar conexao depois rodar porque senao gera lock
  }
}

const migration = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migration;
