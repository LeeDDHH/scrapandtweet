import * as functions from "firebase-functions";

export const loggerLog = (...args: string[]): void => {
  functions.logger.log(args.join(""));
};

export const loggerError = (functionName: string, e: Error): void => {
  functions.logger.error(functionName + e);
};
