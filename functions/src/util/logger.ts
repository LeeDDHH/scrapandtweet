import * as functions from "firebase-functions";

export const loggerLog = <T>(functionName: string, logStat: T): void => {
  functions.logger.log(functionName + logStat);
};

export const loggerError = (functionName: string, e: Error): void => {
  functions.logger.error(functionName + e);
};
