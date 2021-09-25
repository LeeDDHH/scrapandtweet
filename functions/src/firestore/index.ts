import { firestore as adminFireStore } from "firebase-admin";
import dayjs from "dayjs";
import { hasSpecifiedProperty } from "../util/index";
import {
  dbCollectionRSS,
  dbCollectionArchive,
  dbDocV1,
  dbCollectionScheduleToDelivery,
} from "../const";

type PrepareSpecifiedRSSItemsIntoCollection = {
  RSSCollection: FirebaseFirestore.CollectionReference;
  archiveCollection: FirebaseFirestore.CollectionReference;
  archiveRef: FormattedItem[];
  createdDate: number;
};

// RSSコレクションを返す
const _getRSSCollection = (): FirebaseFirestore.CollectionReference => {
  const db = adminFireStore();
  return db
    .collection(dbCollectionRSS)
    .doc(dbDocV1)
    .collection(dbCollectionScheduleToDelivery);
};

// 指定したアーカイブのコレクションを返す
const _getSpecifiedArchiveCollection = (
  collectionName: string
): FirebaseFirestore.CollectionReference => {
  const db = adminFireStore();
  return db
    .collection(dbCollectionArchive)
    .doc(dbDocV1)
    .collection(collectionName);
};

// 指定したアーカイブのコレクションの参照を配列として返す
const _getSpecifiedArchiveRef = async (
  archiveCollectionName: FirebaseFirestore.CollectionReference
): Promise<FormattedItem[]> => {
  const oneWeekBefore = dayjs().add(-7, "day").unix();
  const result = await archiveCollectionName
    .where("createdAt", ">=", oneWeekBefore)
    .get();
  return result.docs.map((doc) => doc.data() as FormattedItem);
};

/*
 * 指定したサイトのコレクションを更新するための準備をする
 * RSSCollection: RSSコレクション
 * archiveCollection: 指定したアーカイブのコレクション
 * archiveRef: 指定したアーカイブのコレクションの参照（配列）
 * createdDate: 実行時の日付
 */
const _prepareSpecifiedRSSItemsIntoCollection = async (
  collectionName: string
): Promise<PrepareSpecifiedRSSItemsIntoCollection> => {
  const RSSCollection = _getRSSCollection();
  const archiveCollection = _getSpecifiedArchiveCollection(collectionName);
  const archiveRef = await _getSpecifiedArchiveRef(archiveCollection);
  const createdDate = dayjs().unix();
  return {
    RSSCollection,
    archiveCollection,
    archiveRef,
    createdDate,
  };
};

// 指定したサイトのコレクションを更新する
export const addNewRSSItemsIntoCollection = async (
  items: FormattedItem[],
  collectionName: string
): Promise<void> => {
  if (!items) return Promise.resolve();
  const { RSSCollection, archiveCollection, archiveRef, createdDate } =
    await _prepareSpecifiedRSSItemsIntoCollection(collectionName);

  await Promise.all(
    items.map(async (item) => {
      if (
        !hasSpecifiedProperty(item, "title") ||
        !hasSpecifiedProperty(item, "link")
      ) {
        return Promise.resolve();
      }
      if (archiveRef.some((ref) => ref?.link === item?.link)) {
        return Promise.resolve();
      }
      const newItem = { ...item, createdAt: createdDate };

      // RSSコレクションに追加
      await RSSCollection.add(newItem);
      // 指定したアーカイブのコレクションに追加
      return await archiveCollection.add(newItem);
    })
  );
};

export const getOneDataFromRSS =
  async (): Promise<FirebaseFirestore.QuerySnapshot> => {
    const RSSCollection = _getRSSCollection();
    return RSSCollection.orderBy("createdAt", "asc").limit(1).get();
  };

export const removeDataFromRSSCollection = async (
  data: FirebaseFirestore.QuerySnapshot
): Promise<void> => {
  await data.docs[0].ref.delete();
};
