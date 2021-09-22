import * as functions from "firebase-functions";
import { scrapAndUpdateRSS, tweetExistRSS } from "../main";
import { loggerLog, loggerError } from "../util/logger";
import {
  runtimeOption,
  logStart,
  logEnd,
  logIndexRunScrap,
  logIndexRunRSSDelivery,
} from "../const";

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

export const runRSSDelivery = functions
  .runWith(<RuntimeOption>runtimeOption)
  .https.onRequest(async (request, response) => {
    try {
      loggerLog(logIndexRunRSSDelivery, logStart);
      await tweetExistRSS();
    } catch (e) {
      loggerError(logIndexRunRSSDelivery, <Error>e);
    }

    loggerLog(logIndexRunRSSDelivery, logEnd);

    response.send("runRSSDelivery complete");
  });
