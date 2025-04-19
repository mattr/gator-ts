import { readConfig, setUser } from "./config.js";
import { createUser, deleteUsers, getUserByName, getUsers } from "./lib/db/queries/users.js";
import { fetchFeed } from "./feed";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;
export type CommandRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandRegistry, cmdName: string, handler: CommandHandler) {
  registry[cmdName] = handler;
}

export async function runCommand(registry: CommandRegistry, cmdName: string, ...args: string[]) {
  const cmd = registry[cmdName];
  if (!cmd) {
    throw new Error(`unknown command: ${cmdName}`)
  }

  await cmd(cmdName, ...args);
}

export async function handlerLogin(cmdName: string, ...args: string[]) {
  const name = args[0];
  if (!name) {
    throw new Error("no username provided");
  }

  const user = await getUserByName(name);
  if (!user) {
    throw new Error("user does not exist");
  }

  setUser(name);
  console.log(`logged in as: ${name}`)
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  const name = args[0];
  if (!name) {
    throw new Error("no name provided");
  }

  const user = await createUser(name);
  if (!user) {
    throw new Error("cannot create user");
  }

  setUser(user.name);
  console.log("user registered", JSON.stringify(user, null, 2));
}

export async function handlerReset(cmdName: string, ...args: string[]) {
  const result = await deleteUsers();
  console.log(`deleted ${result.length} users`);
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
  const users = await getUsers();
  users.forEach((user) => {
    const current = readConfig().currentUserName == user.name;
    console.log(`* ${user.name}${current ? ' (current)' : ''}`)
  });
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");
  console.log(JSON.stringify(feed, null, 2));
}
