import { getRSS } from "../lib/getRSS";
import { addNewColissRSSItemsIntoCollection } from "../firestore/coliss";
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

const _formatColissItem = (item: ColissItem): FormattedColissItem | null => {
  return {
    title: item.title,
    link: item.link,
    shortLink: item.guid ?? "",
    categories: item.categories ?? "",
    isoDate: item.isoDate ?? "",
    sourceFrom: "coliss",
  };
};

const _hasTitleProperty = (item: ColissItem) => {
  return hasSpecifiedProperty(item, propertyTitle) && item.title.length > 0;
};

const _hasLinkProperty = (item: ColissItem) => {
  return hasSpecifiedProperty(item, propertyLink) && item.link.length > 0;
};

const _hasTitleAndLinkProperty = (item: ColissItem) => {
  return _hasTitleProperty(item) && _hasLinkProperty(item);
};

const _colissScrap = async (): Promise<FormattedColissItem[] | null> => {
  loggerLog(logColissScrap, logStart);
  const result: ColissRSS = await getRSS(colissFeedURL);

  if (isEmptyArray(result?.items) || !result) {
    loggerLog(logColissScrap, logScrapedEmpty);
    return null;
  }

  const formattedColissItems = (<ColissItem[]>result.items)
    .map((item) => {
      return _hasTitleAndLinkProperty(item) ? _formatColissItem(item) : null;
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

  const result = await _colissScrap();

  if (isNullOrUndefined(result)) {
    loggerLog(logColissScrapAndUpdate, logNoScrapedItem);
    return logNoScrapedItem;
  }

  await addNewColissRSSItemsIntoCollection(<FormattedColissItem[]>result);

  loggerLog(logColissScrapAndUpdate, logEnd);

  return "complete coliss scrap and update";
};
