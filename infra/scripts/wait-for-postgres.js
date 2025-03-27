const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(/*error,*/ stdout /*, stderror*/) {
    if (stdout !== null && stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\nPostegres esta aceitando conexoes!");
  }
}

process.stdout.write(" aguardando conexao do postgres...");
checkPostgres();
