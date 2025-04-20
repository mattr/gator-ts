# Gator (Typescript version)

Typescript implementation of the "Build a blog aggregator" (gator) project from 
Boot.dev.

## Getting started

This project requires postgresql installed on the system. Create a "gator" db
with appropriate credentials and save this in the `~/.gatorconfig.json` file. 
```json
{
  "db_url": "postgres://user:pass@localhost:5432/gator"
}
```
You will also need a recent version of node installed.

### Register a user
You can register a new user in gator with the `register` command:
```bash
npm start register [username]
```
The username parameter must be unique.

### Log in as an existing user
You can log in (set the current user) via the `login` command:
```bash
npm start login [username]
```
The user must exist before you can log in.

### Reset the database
This function is only intended for testing purposes, and will wipe all users and
feeds from the database.
```bash
npm start reset
```

### List users
You can list the available users in the system with the `users` command; the
currently logged-in user will be identified.
```bash
npm start users
# * user1
# * user2 (current)
# * user 3
```

### Start the aggregator
You can start the feed aggregator loop with the `agg` command. This is intended
to be run in the background or in a separate shell. This will loop over the
registered feeds and fetch any new posts. The aggregator accepts a period to 
perform refreshes, which is a number and a unit. Allowed units are 
`ms` (milliseconds), `s` (seconds), `m` (minutes) and `h` (hours).
```bash
npm start agg 1m
```

### List feeds
You can list the currently registered feeds with the `feeds` command. This will
also list who added the feed.
```bash
npm start feeds
```

### Add a new feed
You can add a new feed with the `addfeed` command. This requires a name for the 
feed and the feed URL as parameters:
```bash
npm start addfeed "My RSS feed" "https://example.com/feed.xml"
```
You must be logged in to perform this action.

### Follow a feed
You can set the current user to follow an existing feed with the `follow`
command. This accepts the URL of the feed as a parameter. Note that this will
NOT add the feed if it does not already exist.
```bash
npm start follow "https://example.com/rss.xml"
```
You must be logged in to perform this action.

### List the feeds the current user is following
You can list the feeds followed by the current user with the `following` command.
```bash
npm start following
```
You must be logged in to perform this action.

### Unfollow a feed
You can remove a feed from your following list with the `unfollow` command. This
accepts the URL of the feed as a parameter.
```bash
npm start unfollow "https://example.com/rss.xml"
```
You must be logged in to perform this action.

### Browse your feeds
You can browse the most recent `n` entries. If no number is specified, it will 
show the most recent 2 entries.
```bash
npm browse 10
```
