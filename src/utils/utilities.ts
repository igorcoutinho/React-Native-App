import _ from 'lodash';
import Contacts from 'react-native-contacts';

interface Sortable {
  [key: string]: any;
}

/**
 * Get a value from an object safely.
 * @param obj - The object to get the value from.
 * @param propsArg - The path to the value.
 * @returns The value.
 */
export const safeGetObject = (
  obj: {
    [key: string]: any;
  },
  propsArg: string,
): null | {} => {
  if (!obj) {
    return null;
  }
  let props: string[] = null;
  let prop = null;
  if (typeof propsArg === 'string') {
    props = propsArg.split('.');
  }
  while (props?.length) {
    prop = props.shift();
    if (!obj || !prop) {
      return null;
    }
    obj = obj[prop];
    if (obj === undefined) {
      return null;
    }
  }
  return obj;
};

/**
 * Set a value in an object safely.
 * @param obj - The object to set the value in.
 * @param propsArg - The path to the value.
 * @param value - The value to set.
 * @returns Whether the value was set.
 */
export const safeSetObject = (
  obj: {
    [key: string]: any;
  },
  propsArg: string,
  value: any,
): boolean => {
  let props: string[] = null;
  let lastProp: any = null;
  if (typeof propsArg === 'string') {
    props = propsArg.split('.');
  }
  lastProp = props.pop();
  if (!lastProp) {
    return false;
  }
  prototypeCheck(lastProp);
  let thisProp: any = null;
  while ((thisProp = props.shift())) {
    prototypeCheck(thisProp);
    if (typeof obj[thisProp] === 'undefined') {
      obj[thisProp] = {};
    }
    obj = obj[thisProp];
    if (!obj || typeof obj !== 'object') {
      return false;
    }
  }
  obj[lastProp] = value;
  return true;
};

function prototypeCheck(prop: any) {
  if (prop === '__proto__' || prop === 'constructor' || prop === 'prototype') {
    throw new Error('Setting of prototype values not supported');
  }
}

/**
 * Parse a JSON string safely.
 * @param string - The JSON string to parse.
 * @returns The parsed JSON object.
 * @returns null if the JSON string is invalid.
 */
export const safeJsonParse = <T>(string: string) => {
  try {
    const json: T = JSON.parse(string);
    return json;
  } catch {
    return null;
  }
};

/**
 * Stringify an object safely.
 * @param object - The object to stringify.
 * @returns The JSON string.
 * @returns An empty string if the JSON string is invalid.
 */
export const safeJsonString = (object: any) => {
  try {
    const value: string = JSON.stringify(object);
    return value;
  } catch {
    return '';
  }
};

/**
 * Get the initials of a name.
 * @param textString - The name to get the initials from.
 * @returns The initials.
 */
export const getAvatarInitials = (textString: string) => {
  if (!textString) return '';
  const text = textString.trim();
  const textSplit = text.split(' ');
  if (textSplit.length <= 1) return text.charAt(0);
  const initials =
    textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
  return initials;
};

/**
 * Get the full name from a Contact object.
 * @param data - The Contact object.
 * @returns The full name.
 */
export const getNameFromContact = (data: Contacts.Contact) => {
  const nameArray = [data?.givenName, data?.middleName, data?.familyName];
  return `${nameArray.filter(n => !!n).join(' ')}`;
};

export const cleanExtraBlankSpaces = (str: string) => {
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * Get a value from an object safely.
 * @param list - The object to get the value from.
 * @param propsArg - The path to the value.
 * @returns The value.
 */
export const sortByField = <T extends Sortable>(list: T[], field: keyof T): T[] => {
  return _.sortBy(list, [field]);
};