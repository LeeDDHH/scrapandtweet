import { colissScrapAndUpdate } from "../scrapContent/coliss";
import { loggerLog, loggerError } from "../util/logger";
import { logStart, logEnd, logScrapAndUpdateRSS } from "../const";

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
