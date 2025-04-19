import {
  type CommandRegistry,
  handlerAddFeed,
  handlerAgg,
  handlerFeeds,
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
  registerCommand,
  runCommand
} from "./handlers.js";

const registry: CommandRegistry = {}
registerCommand(registry, "login", handlerLogin);
registerCommand(registry, "register", handlerRegister);
registerCommand(registry, "reset", handlerReset);
registerCommand(registry, "users", handlerUsers);
registerCommand(registry, "agg", handlerAgg);
registerCommand(registry, "addfeed", handlerAddFeed);
registerCommand(registry, "feeds", handlerFeeds);

async function main() {
  // [node, file, cmdName, [args]]
  const [_node, _file, cmdName, ...args] = process.argv;

  if (!cmdName) {
    console.log("no command provided");
    process.exit(1);
  }

  try {
    await runCommand(registry, cmdName, ...args);
    process.exit(0);
  } catch (e: any) {
    console.log(e.message);
    process.exit(1);
  }
}

await main();
