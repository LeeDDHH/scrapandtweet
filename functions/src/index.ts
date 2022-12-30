import * as admin from "firebase-admin";
import * as request from "./request";

admin.initializeApp();

export const requestByURL = { ...request };
