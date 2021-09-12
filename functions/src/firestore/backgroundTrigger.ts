import { firestore } from "firebase-functions";
import { getColissArchive } from "./index";

export const addNewRSSIntoArchive = firestore
  .document("/rss/{version}/{scrapTarget}/{documentId}")
  .onCreate(async (snap, context) => {
    const original = snap.data().original;
    const colissArchiveCollection = getColissArchive();
    await colissArchiveCollection.add({ ...original });
  });
