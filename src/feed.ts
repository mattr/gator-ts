import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  const response = await fetch(feedURL, {
    headers: { "User-Agent": "gator", }
  }).then(response => response.text());
  const parser = new XMLParser();
  const rss = parser.parse(response);

  const channel = rss?.rss?.channel;
  if (!channel) {
    throw new Error(`Unable to parse channel for "${feedURL}"`);
  }

  const { title, link, description } = channel;
  if (!title || !link || !description) {
    throw new Error(`Unable to parse metadata for "${feedURL}"`);
  }

  let item: RSSItem[] = [];
  if (channel.item && Array.isArray(channel.item)) {
    channel.item.forEach((it: any) => {
      const { title, link, description, pubDate } = it;
      if (title && link && description && pubDate) {
        item.push({ title, link, description, pubDate });
      }
    });
  }

  return { channel: { title, link, description, item } };
}
