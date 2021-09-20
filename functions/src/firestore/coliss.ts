import { loggerLog } from "../util/logger";
import { addNewRSSItemsIntoCollection } from "./index";
import {
  logStart,
  logEnd,
  logAddNewColissRSSItemsIntoCollection,
  dbCollectionColiss,
} from "../const";

export const addNewColissRSSItemsIntoCollection = async (
  items: FormattedColissItem[]
): Promise<void> => {
  loggerLog(logAddNewColissRSSItemsIntoCollection, logStart);

  await addNewRSSItemsIntoCollection<FormattedColissItem>(
    items,
    dbCollectionColiss
  );

  loggerLog(logAddNewColissRSSItemsIntoCollection, logEnd);
};
