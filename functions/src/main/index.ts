import { specifiedMediaScrapAndUpdate } from "../scrapContent";
import { getOneDataFromRSS, removeDataFromRSSCollection } from "../firestore";
import { tweetRSS } from "../lib/twitter";
import { loggerLog, loggerError } from "../util/logger";
import {
  logStart,
  logEnd,
  logScrapAndUpdateRSS,
  logNoTweetItem,
  mediaNameColiss,
  mediaNamePhotoShopVip,
  mediaNameUxMilk,
  mediaNameICSMedia,
  mediaNameCSSTricks,
  mediaNameMuuuuuOrg,
  mediaWebDesignTrends,
} from "../const";

export const scrapAndUpdateRSS = async (): Promise<string> => {
  loggerLog(logScrapAndUpdateRSS, logStart);

  try {
    await specifiedMediaScrapAndUpdate(mediaNameColiss);
    await specifiedMediaScrapAndUpdate(mediaNamePhotoShopVip);
    await specifiedMediaScrapAndUpdate(mediaNameUxMilk);
    await specifiedMediaScrapAndUpdate(mediaNameICSMedia);
    await specifiedMediaScrapAndUpdate(mediaNameCSSTricks);
    await specifiedMediaScrapAndUpdate(mediaNameMuuuuuOrg);
    await specifiedMediaScrapAndUpdate(mediaWebDesignTrends);
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
