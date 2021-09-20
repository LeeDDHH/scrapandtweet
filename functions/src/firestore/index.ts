import { firestore as adminFireStore } from "firebase-admin";
import dayjs from "dayjs";
import { hasSpecifiedProperty } from "../util/index";
import {
  dbCollectionRSS,
  dbCollectionArchive,
  dbDocV1,
  dbCollectionScheduleToDelivery,
} from "../const";

type PrepareSpecifiedRSSItemsIntoCollection<T> = {
  RSSCollection: FirebaseFirestore.CollectionReference;
  archiveCollection: FirebaseFirestore.CollectionReference;
  archiveRef: T[];
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
const _getSpecifiedArchiveRef = async <T>(
  archiveCollectionName: FirebaseFirestore.CollectionReference
): Promise<T[]> => {
  const result = await archiveCollectionName.get();
  return result.docs.map((doc) => doc.data() as T);
};

/*
 * 指定したサイトのコレクションを更新するための準備をする
 * RSSCollection: RSSコレクション
 * archiveCollection: 指定したアーカイブのコレクション
 * archiveRef: 指定したアーカイブのコレクションの参照（配列）
 * createdDate: 実行時の日付
 */
const _prepareSpecifiedRSSItemsIntoCollection = async <T>(
  collectionName: string
): Promise<PrepareSpecifiedRSSItemsIntoCollection<T>> => {
  const RSSCollection = _getRSSCollection();
  const archiveCollection = _getSpecifiedArchiveCollection(collectionName);
  const archiveRef = await _getSpecifiedArchiveRef<T>(archiveCollection);
  const createdDate = dayjs().unix();
  return {
    RSSCollection,
    archiveCollection,
    archiveRef,
    createdDate,
  };
};

// 指定したサイトのコレクションを更新する
export const addNewRSSItemsIntoCollection = async <T extends FormattedItem>(
  items: T[],
  collectionName: string
): Promise<void> => {
  const { RSSCollection, archiveCollection, archiveRef, createdDate } =
    await _prepareSpecifiedRSSItemsIntoCollection<FormattedColissItem>(
      collectionName
    );

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
