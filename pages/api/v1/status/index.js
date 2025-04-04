import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller";
const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updateAt = new Date().toISOString();

  const versaoPG = await database.query("SHOW server_version;"); //SELECT version();");
  const versaoPGValue = versaoPG.rows[0].server_version;

  const conexoes = await database.query(
    //"select setting::int max_conn from pg_settings where name=$$max_connections$$",
    "SHOW max_connections;",
  );
  const max_conn = parseInt(conexoes.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const conUsada = await database.query({
    text: "select count(*)::int from pg_stat_activity where datname=$1;",
    values: [databaseName],
  });
  //"select count(*) used from pg_stat_activity",
  const conUsadaValue = conUsada.rows[0].count;

  response.status(200).json({
    update_at: updateAt,
    dependencies: {
      database: {
        version: versaoPGValue,
        max_connections: max_conn,
        opened_connections: conUsadaValue,
      },
    },
  });
}
