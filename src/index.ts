import { type CommandRegistry, handlerLogin, registerCommand, runCommand } from "./handlers.js";

function main() {
  const registry: CommandRegistry = {}
  registerCommand(registry,"login", handlerLogin);

  // [node, file, cmdName, [args]]
  const [_node, _file, cmdName, ...args] = process.argv;

  if (!cmdName) {
    console.log("no command provided");
    process.exit(1);
  }

  try {
    runCommand(registry, cmdName, ...args);
  } catch (e: any) {
    console.log(e.message);
    process.exit(1);
  }
}

main();
