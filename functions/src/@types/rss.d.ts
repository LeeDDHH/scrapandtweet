declare type ColissItem = {
  creator: string;
  title: string;
  link: string;
  pubDate: string;
  "dc:creator": string;
  content: string;
  contentSnippet: string;
  guid: string;
  categories: string[];
  isoDate: string;
};

declare interface ColissRSS {
  items: ColissItem[];
  feedUrl: "https://coliss.com/feed/";
  paginationLinks: { self: "https://coliss.com/feed/" };
  title: "コリス";
  description: string;
  generator: string;
  link: "https://coliss.com";
  language: "ja";
  lastBuildDate: string;
}

declare type Coliss = ColissRSS | null;

declare type FormattedColissItem = {
  title: string | "";
  link: string | "";
  guid: string | "";
  categories: string[] | "";
  isoDate: string | "";
};

declare type MinimumFormattedItem = {
  title: string | "";
  link: string | "";
};

declare type FormattedItem = MinimumFormattedItem | FormattedColissItem;
