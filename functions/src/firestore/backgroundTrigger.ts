// import { firestore } from "firebase-functions";
// import { getColissArchive } from "./index";

// export const addNewRSSIntoArchive = firestore
//   .document("/rss/{version}/{scrapTarget}/{documentId}")
//   .onCreate(async (snap, context) => {
//     const originalData = snap.data();
//     const colissArchiveCollection = getColissArchive();
//     await colissArchiveCollection.add({ ...originalData });
//   });
