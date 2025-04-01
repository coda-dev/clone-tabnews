import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdateAt />
    </>
  );
}

function UpdateAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    dedupingInterval: 2000,
  });

  let update_at = "Carregando...";
  let version = "";
  let max_connections = "0";
  let opened_connections = "0";

  if (!isLoading && data) {
    update_at = new Date(data.update_at).toLocaleString("pt-BR");
    version = data.dependencies.database.version;
    max_connections = data.dependencies.database.max_connections;
    opened_connections = data.dependencies.database.opened_connections;
  }

  /* <pre>{JSON.stringify(response.data, null, 2)}</pre> */
  return (
    <div>
      <div>Última atualização: {update_at}</div>
      <ul>
        <li>Versao: {version}</li>
        <li>Maximo Conexoes: {max_connections}</li>
        <li>Conexoes abertas: {opened_connections}</li>
      </ul>
    </div>
  );
}

/*
{
  "update_at": "2025-04-01T14:46:21.237Z",
  "dependencies": {
    "database": {
      "version": "16.6",
      "max_connections": 100,
      "opened_connections": 1
    }
  }
}

function CapsLock(param1) {
  console.log(param1);
  const textoCapsLock = param1.texto.toUpperCase();
  return textoCapsLock
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <CapsLock texto="teste texto" />
    </>
  );
}

*/
