import { firestore as adminFireStore } from "firebase-admin";
import dayjs from "dayjs";
import { loggerLog } from "../util/logger";
import {
  logStart,
  logEnd,
  logAddNewColissRSSItemsIntoCollection,
  dbCollectionArchive,
  dbCollectionRSS,
  dbDocV1,
  dbCollectionColiss,
} from "../const";

const getColissRSS = (): FirebaseFirestore.CollectionReference => {
  const db = adminFireStore();
  return db
    .collection(dbCollectionRSS)
    .doc(dbDocV1)
    .collection(dbCollectionColiss);
};

const getColissRef = async (
  colissCollection: FirebaseFirestore.CollectionReference
): Promise<FormattedColissItem[]> => {
  const result = await colissCollection.get();
  return result.docs.map((doc) => doc.data() as FormattedColissItem);
};

export const getColissArchive = (): FirebaseFirestore.CollectionReference => {
  const db = adminFireStore();
  return db
    .collection(dbCollectionArchive)
    .doc(dbDocV1)
    .collection(dbCollectionColiss);
};

export const addNewColissRSSItemsIntoCollection = async (
  items: FormattedColissItem[]
): Promise<void> => {
  loggerLog(logAddNewColissRSSItemsIntoCollection, logStart);

  const colissRSSCollection = getColissRSS();
  const colissArchiveCollection = getColissArchive();
  const colissRef = await getColissRef(colissArchiveCollection);
  const createdDate = dayjs().unix();

  await Promise.all(
    items.map(async (item) => {
      if (colissRef.some((ref) => ref?.link === item.link)) {
        return Promise.resolve();
      }
      return await colissRSSCollection.add({
        ...item,
        createdAt: createdDate,
      });
    })
  );
  loggerLog(logAddNewColissRSSItemsIntoCollection, logEnd);
};
