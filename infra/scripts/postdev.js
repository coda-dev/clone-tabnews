const { exec } = require("node:child_process");

exec("cmd", (err, stdout, stderr) => {
  console.log("stdout is:" + stdout);
  console.log("stderr is:" + stderr);
  console.log("error is:" + err);
}).on("exit", (code) => console.log("final exit code is", code));
