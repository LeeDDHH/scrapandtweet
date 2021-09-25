import { mediaData } from "../data/mediaData";

export const isNullOrUndefined = <T>(args: T): boolean => {
  return typeof args === "undefined" || args == null ? true : false;
};

export const isEmptyArray = <T>(args: T): boolean => {
  return isNullOrUndefined(args) || (Array.isArray(args) && args.length === 0)
    ? true
    : false;
};

export const hasSpecifiedProperty = <T>(
  item: T,
  identifier: string
): boolean => {
  return Object.prototype.hasOwnProperty.call(item, identifier);
};

export const makeShortTitle = (title: string, maxLength: number): string => {
  const retitle =
    title.length > maxLength ? title.substr(0, maxLength) + "..." : title;
  return `📝 ${retitle}`;
};

export const convertTwitterAccount = (sourceFrom: string): string => {
  const mediaDataObject = <MediaDataObject>mediaData;
  return mediaDataObject[sourceFrom].twitter
    ? `🏡 ${mediaDataObject[sourceFrom].twitter}`
    : "";
};
