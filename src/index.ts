import {
  type CommandHandler,
  type CommandRegistry,
  handlerAddFeed,
  handlerAgg,
  handlerFeeds,
  handlerFollow,
  handlerFollowing,
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
  registerCommand,
  runCommand,
  type UserCommandHandler
} from "./handlers.js";
import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";

function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async function(cmdName: string, ...args: string[]) {
    const user = await getUserByName(readConfig().currentUserName);
    if (!user) {
      throw new Error("user not found");
    }

    return handler(cmdName, user, ...args);
  }
}

const registry: CommandRegistry = {}
registerCommand(registry, "login", handlerLogin);
registerCommand(registry, "register", handlerRegister);
registerCommand(registry, "reset", handlerReset);
registerCommand(registry, "users", handlerUsers);
registerCommand(registry, "agg", handlerAgg);
registerCommand(registry, "feeds", handlerFeeds);
registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));

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
