import { createRouter } from "next-connect";
import controller from "infra/controller";
import migration from "models/migrator.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const pendingMigrataions = await migration.listPendingMigrations();
  return response.status(200).json(pendingMigrataions);
}

async function postHandler(request, response) {
  const migracoesMigrataions = await migration.runPendingMigrations();

  if (migracoesMigrataions.length > 0) {
    return response.status(201).json(migracoesMigrataions); // 201 - altecao foi criada a migration
  }
  return response.status(200).json(migracoesMigrataions);
}
