import { getRSS } from "../lib/getRSS";
import { addNewColissRSSItemsIntoCollection } from "../firestore/index";
import { isNullOrUndefined, isEmptyArray, hasSpecifiedProperty } from "../util";
import { loggerLog } from "../util/logger";
import {
  logStart,
  logEnd,
  logScrapedEmpty,
  logFormattedEmpty,
  logNoScrapedItem,
  logColissScrap,
  logColissScrapAndUpdate,
  propertyTitle,
  propertyLink,
  colissFeedURL,
} from "../const";

const formatColissItem = (item: ColissItem): FormattedColissItem | null => {
  return {
    title: item.title,
    link: item.link,
    guid: item.guid ?? "",
    categories: item.categories ?? "",
    isoDate: item.isoDate ?? "",
  };
};

const hasTitleProperty = (item: ColissItem) => {
  return hasSpecifiedProperty(item, propertyTitle) && item.title.length > 0;
};

const hasLinkProperty = (item: ColissItem) => {
  return hasSpecifiedProperty(item, propertyLink) && item.link.length > 0;
};

const hasTitleAndLinkProperty = (item: ColissItem) => {
  return hasTitleProperty(item) && hasLinkProperty(item);
};

const colissScrap = async (): Promise<FormattedColissItem[] | null> => {
  loggerLog(logColissScrap, logStart);
  const result: ColissRSS = await getRSS(colissFeedURL);

  if (isEmptyArray(result?.items) || !result) {
    loggerLog(logColissScrap, logScrapedEmpty);
    return null;
  }

  const formattedColissItems = (<ColissItem[]>result.items)
    .map((item) => {
      return hasTitleAndLinkProperty(item) ? formatColissItem(item) : null;
    })
    .filter(Boolean);

  if (isEmptyArray(formattedColissItems)) {
    loggerLog(logColissScrap, logFormattedEmpty);
    return null;
  }

  loggerLog(logColissScrap, logEnd);
  return <FormattedColissItem[]>formattedColissItems;
};

export const colissScrapAndUpdate = async (): Promise<string> => {
  loggerLog(logColissScrapAndUpdate, logStart);

  const result = await colissScrap();

  if (isNullOrUndefined(result)) {
    loggerLog(logColissScrapAndUpdate, logNoScrapedItem);
    return logNoScrapedItem;
  }

  await addNewColissRSSItemsIntoCollection(<FormattedColissItem[]>result);

  loggerLog(logColissScrapAndUpdate, logEnd);

  return "complete coliss scrap and update";
};
