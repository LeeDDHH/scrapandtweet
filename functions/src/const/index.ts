export const runtimeOption = {
  timeoutSeconds: 100,
  memory: "512MB",
};
export const logStart = "start";
export const logEnd = "end";
export const logScrapedEmpty = "scraped empty";
export const logFormattedEmpty = "formatted result empty";
export const logNoScrapedItem = "no scraped item";
export const logNoTweetItem = "no tweet item";
export const logIndexRunScrap = "【index】 " + "【runScrap】 ";
export const logIndexRunRSSDelivery = "【index】 " + "【runRSSDelivery】 ";
export const logScrapAndUpdateRSS =
  "【main#index】 " + "【scrapAndUpdateRSS】 ";
export const logColissScrap = "【scrapContent#index】 " + "【colissScrap】 ";
export const logColissScrapAndUpdate =
  "【scrapContent#index】 " + "【colissScrapAndUpdate】 ";
export const logAddNewColissRSSItemsIntoCollection =
  "【firestore#index】 " + "【addNewColissRSSItemsIntoCollection】 ";

export const propertyTitle = "title";
export const propertyLink = "link";

export const dbCollectionArchive = "archive";
export const dbCollectionRSS = "rss";
export const dbDocV1 = "v1";
export const dbCollectionColiss = "coliss";
export const dbCollectionScheduleToDelivery = "scheduleToDelivery";

export const colissFeedURL = "https://coliss.com/feed/";

export const twitterAccount = {
  coliss: "@colisscom",
};
