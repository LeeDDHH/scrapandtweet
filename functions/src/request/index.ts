import * as functions from "firebase-functions";
import { scrapAndUpdateRSS } from "../main";
import { loggerLog, loggerError } from "../util/logger";
import { runtimeOption, logStart, logEnd, logIndexRunScrap } from "../const";

export const runScrap = functions
  .runWith(<RuntimeOption>runtimeOption)
  .https.onRequest(async (request, response) => {
    try {
      loggerLog(logIndexRunScrap, logStart);
      await scrapAndUpdateRSS();
    } catch (e) {
      loggerError(logIndexRunScrap, <Error>e);
    }

    loggerLog(logIndexRunScrap, logEnd);

    response.send("runScrap complete");
  });
