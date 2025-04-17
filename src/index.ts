import { readConfig, setUser } from "./config.js";

function main() {
  setUser("matt");

  const config = readConfig();
  console.log(JSON.stringify(config, null, 2));
}

main();
