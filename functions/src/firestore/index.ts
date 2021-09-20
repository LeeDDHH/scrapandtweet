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
  dbCollectionScheduleToDelivery,
} from "../const";

type PrepareColissRSSItemsIntoCollection = {
  colissRSSCollection: FirebaseFirestore.CollectionReference;
  colissArchiveCollection: FirebaseFirestore.CollectionReference;
  colissRef: FormattedColissItem[];
  createdDate: number;
};

const _getRSSCollection = (): FirebaseFirestore.CollectionReference => {
  const db = adminFireStore();
  return db
    .collection(dbCollectionRSS)
    .doc(dbDocV1)
    .collection(dbCollectionScheduleToDelivery);
};

const _getColissRef = async (
  colissCollection: FirebaseFirestore.CollectionReference
): Promise<FormattedColissItem[]> => {
  const result = await colissCollection.get();
  return result.docs.map((doc) => doc.data() as FormattedColissItem);
};

const _getColissArchive = (): FirebaseFirestore.CollectionReference => {
  const db = adminFireStore();
  return db
    .collection(dbCollectionArchive)
    .doc(dbDocV1)
    .collection(dbCollectionColiss);
};

const _prepareColissRSSItemsIntoCollection =
  async (): Promise<PrepareColissRSSItemsIntoCollection> => {
    const colissRSSCollection = _getRSSCollection();
    const colissArchiveCollection = _getColissArchive();
    const colissRef = await _getColissRef(colissArchiveCollection);
    const createdDate = dayjs().unix();
    return {
      colissRSSCollection,
      colissArchiveCollection,
      colissRef,
      createdDate,
    };
  };

export const addNewColissRSSItemsIntoCollection = async (
  items: FormattedColissItem[]
): Promise<void> => {
  loggerLog(logAddNewColissRSSItemsIntoCollection, logStart);

  const {
    colissRSSCollection,
    colissArchiveCollection,
    colissRef,
    createdDate,
  } = await _prepareColissRSSItemsIntoCollection();

  await Promise.all(
    items.map(async (item) => {
      if (colissRef.some((ref) => ref?.link === item.link)) {
        return Promise.resolve();
      }
      const newItem = { ...item, createdAt: createdDate };
      await colissRSSCollection.add(newItem);
      return await colissArchiveCollection.add(newItem);
    })
  );
  loggerLog(logAddNewColissRSSItemsIntoCollection, logEnd);
};
