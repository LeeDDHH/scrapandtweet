import Parser from "rss-parser";

export const getRSS = async (feedURL: string): Promise<null | any> => {
  if (!feedURL) return Promise.resolve(null);
  const parser = new Parser();
  return await parser.parseURL(feedURL);
};
