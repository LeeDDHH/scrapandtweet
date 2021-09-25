import { getRSS } from "../lib/getRSS";
import { addNewRSSItemsIntoCollection } from "../firestore";
import { isNullOrUndefined, isEmptyArray, hasSpecifiedProperty } from "../util";
import { loggerLog } from "../util/logger";
import {
  logStart,
  logEnd,
  logScrapedEmpty,
  logFormattedEmpty,
  logNoScrapedItem,
  logScrap,
  logSpecifiedMediaScrapAndUpdate,
  propertyTitle,
  propertyLink,
} from "../const";
import { mediaData } from "../data/mediaData";

const _formatItem = (
  item: RSSItem,
  mediaName: SourceFrom
): FormattedRSSItem | null => {
  return {
    title: item.title,
    link: item.link,
    shortLink: item.guid ?? "",
    categories: item.categories ?? "",
    isoDate: item.isoDate ?? "",
    sourceFrom: mediaName,
  };
};

const _hasTitleProperty = (item: RSSItem) => {
  return hasSpecifiedProperty(item, propertyTitle) && item.title.length > 0;
};

const _hasLinkProperty = (item: RSSItem) => {
  return hasSpecifiedProperty(item, propertyLink) && item.link.length > 0;
};

const _hasTitleAndLinkProperty = (item: RSSItem) => {
  return _hasTitleProperty(item) && _hasLinkProperty(item);
};

const getFeedURL = (mediaName: string) => {
  const mediaDataObject: MediaDataObject = mediaData;
  return mediaDataObject[mediaName]?.feedURL;
};

const _scrapData = async (
  mediaName: SourceFrom
): Promise<FormattedRSSItem[] | null> => {
  loggerLog(logScrap, `【${mediaName}】 `, logStart);

  const feedURL = getFeedURL(mediaName);

  const result: RSS = await getRSS(feedURL);

  if (!result || isEmptyArray(result?.items)) {
    loggerLog(logScrap, `【${mediaName}】 `, logScrapedEmpty);
    return Promise.resolve(null);
  }

  const formattedItems = (<RSSItem[]>result.items)
    .map((item) => {
      return _hasTitleAndLinkProperty(item)
        ? _formatItem(item, mediaName)
        : Promise.resolve(null);
    })
    .filter(Boolean);

  if (isEmptyArray(formattedItems)) {
    loggerLog(logScrap, `【${mediaName}】 `, logFormattedEmpty);
    return Promise.resolve(null);
  }

  loggerLog(logScrap, `【${mediaName}】 `, logEnd);
  return <FormattedRSSItem[]>formattedItems;
};

export const specifiedMediaScrapAndUpdate = async (
  mediaName: SourceFrom
): Promise<string> => {
  loggerLog(logSpecifiedMediaScrapAndUpdate, `【${mediaName}】 `, logStart);

  let data: FormattedRSSItem[];
  const result: FormattedRSSItem[] | null = await _scrapData(mediaName);

  if (isNullOrUndefined(result)) {
    loggerLog(
      logSpecifiedMediaScrapAndUpdate,
      `【${mediaName}】 `,
      logNoScrapedItem
    );
    return Promise.resolve(logNoScrapedItem);
  } else {
    data = result ? result : [];
  }

  await addNewRSSItemsIntoCollection(data, mediaName);

  loggerLog(logSpecifiedMediaScrapAndUpdate, `【${mediaName}】 `, logEnd);

  return "complete coliss scrap and update";
};
