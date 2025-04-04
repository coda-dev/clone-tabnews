import { Client } from "pg";
import { ServiceError } from "./errors.js";
async function query(queryObject) {
  let client; // usamos let porque não inicializamos a variavel mesma linha
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const errorObject = new ServiceError({
      message: "Erro na conexão com banco de dados ou a query.",
      cause: error,
    });
    throw errorObject;
  } finally {
    await client?.end(); // client? - significa se ele não possui propriedade undefined, ou seja, se nao e nulo
  }
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });
  await client.connect();
  return client;
}

const dataBase = {
  query,
  getNewClient,
};
export default dataBase;
