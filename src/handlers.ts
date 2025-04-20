import { readConfig, setUser } from "./config.js";
import { createUser, deleteUsers, getUserById, getUserByName, getUsers } from "./lib/db/queries/users.js";
import { fetchFeed } from "./feed";
import { createFeed, deleteFeeds, getFeedByUrl, getFeeds } from "./lib/db/queries/feeds.js";
import { Feed, User } from "./lib/db/schema.js";
import { createFeedFollow, getFeedFollowsForUser } from "./lib/db/queries/feed-follows";

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
  const users = await deleteUsers();
  const feeds = await deleteFeeds();
  console.log(`deleted ${users.length} users`);
  console.log(`deleted ${feeds.length} feeds`);
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

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
  const [name, url] = args;
  if (!name) {
    throw new Error("no feed name provided");
  }
  if (!url) {
    throw new Error("no feed url provided");
  }

  const user = await getUserByName(readConfig().currentUserName);
  const feed = await createFeed(name, url, user.id);
  await createFeedFollow(user.id, feed.id);
  printFeed(feed, user);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  const feeds = await getFeeds();
  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    console.log(`${feed.name}: ${feed.url} (${user.name})`);
  }
}

export async function handlerFollow(cmdName: string, ...args: string[]) {
  const url = args[0];
  if (!url) {
    throw new Error("no feed url provided to follow");
  }

  const feed = await getFeedByUrl(url);
  if (!feed) {
    // TODO: Automatically create a feed?
    throw new Error("feed not found");
  }

  const user = await getUserByName(readConfig().currentUserName);
  if (!user) {
    throw new Error("no user logged in");
  }

  const follow = await createFeedFollow(user.id, feed.id);
  if (follow) {
    console.log(`${follow.userName} is now following "${follow.feedName}"`);
  }
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
  const user = await getUserByName(readConfig().currentUserName);
  if (!user) {
    throw new Error("no user logged in");
  }

  const follows = await getFeedFollowsForUser(user.id);
  console.log(`${user.name} is following:`);
  follows.forEach((follow) => {
    console.log(`* ${follow.feedName}`);
  });
}

function printFeed(feed: Feed, user: User) {
  console.log("feed", JSON.stringify(feed, null, 2));
  console.log("user", JSON.stringify(user, null, 2));
}
