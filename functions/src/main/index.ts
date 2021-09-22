import { colissScrapAndUpdate } from "../scrapContent/coliss";
import { getOneDataFromRSS, removeDataFromRSSCollection } from "../firestore";
import { tweetRSS } from "../lib/twitter";
import { loggerLog, loggerError } from "../util/logger";
import {
  logStart,
  logEnd,
  logScrapAndUpdateRSS,
  logNoTweetItem,
} from "../const";

export const scrapAndUpdateRSS = async (): Promise<string> => {
  loggerLog(logScrapAndUpdateRSS, logStart);

  try {
    await colissScrapAndUpdate();
  } catch (e) {
    loggerError(logScrapAndUpdateRSS, <Error>e);
  }

  loggerLog(logScrapAndUpdateRSS, logEnd);

  return "scrap complete";
};

export const tweetExistRSS = async (): Promise<string> => {
  loggerLog(logScrapAndUpdateRSS, logStart);

  try {
    const data = await getOneDataFromRSS();
    if (data.empty) {
      loggerLog(logScrapAndUpdateRSS, logNoTweetItem);
    }
    await tweetRSS(data);
    await removeDataFromRSSCollection(data);
  } catch (e) {
    loggerError(logScrapAndUpdateRSS, <Error>e);
  }

  loggerLog(logScrapAndUpdateRSS, logEnd);

  return "scrap complete";
};
