export const isNullOrUndefined = <T>(args: T): boolean => {
  return typeof args === "undefined" || args == null ? true : false;
};

export const isEmptyArray = <T>(args: T): boolean => {
  return isNullOrUndefined(args) || (Array.isArray(args) && args.length === 0)
    ? true
    : false;
};

export const hasSpecifiedProperty = <T>(item: T, identifier: string) => {
  return Object.prototype.hasOwnProperty.call(item, identifier);
};
