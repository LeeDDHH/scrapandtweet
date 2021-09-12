import Parser from "rss-parser";

export const getRSS = async <T>(feedURL: string): Promise<null | any> => {
  const parser = new Parser();
  return await parser.parseURL(feedURL);
};
