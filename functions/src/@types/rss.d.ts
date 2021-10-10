declare type RSSItem = {
  creator: string;
  title: string;
  link: string;
  pubDate: string;
  "content:encoded"?: string;
  "content:encodedSnippet"?: string;
  "dc:creator": string;
  content: string;
  contentSnippet: string;
  guid: string;
  categories: string[];
  isoDate: string;
};

declare interface RSS {
  items: RSSItem[];
  feedUrl: string;
  paginationLinks: { self: string };
  title: string;
  description: string;
  generator: string;
  link: string;
  language: "ja";
  lastBuildDate: string;
}

declare type SourceFrom =
  | "coliss"
  | "photoshopvip"
  | "uxmilk"
  | "icsmedia"
  | "csstricks"
  | "muuuuuorg"
  | "webdesigntrends"
  | "onlinetutoria16"
  | "kevinpowell"
  | "partsdesign";

declare type FormattedRSSItem = {
  title: string | "";
  link: string | "";
  shortLink: string | "";
  categories: string[] | "";
  isoDate: string | "";
  sourceFrom: SourceFrom;
};

declare type MinimumFormattedItem = {
  title: string | "";
  link: string | "";
  shortLink: string | "";
  sourceFrom: string;
};

declare type FormattedItem = MinimumFormattedItem | FormattedRSSItem;

declare type MediaDataObject = {
  [index: string]: {
    twitter: string;
    feedURL: string;
  };
};
