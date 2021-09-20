import { initializeApp } from "firebase-admin";
import * as request from "./request";

initializeApp();

export const requestByURL = { ...request };
