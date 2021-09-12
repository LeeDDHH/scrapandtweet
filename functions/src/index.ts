import { initializeApp } from "firebase-admin";
import * as request from "./request";
import * as firestoreBackgroundTrigger from "./firestore/backgroundTrigger";

initializeApp();

export const requestByURL = { ...request };
export const firestoreBackgroundTriggers = { ...firestoreBackgroundTrigger };
