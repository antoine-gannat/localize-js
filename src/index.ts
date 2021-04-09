import { throwError } from "./logger";

export interface IOptions {
  /**
   * Language requested.
   * Usually looking like "en" or "en_US".
   */
  locale: string;
}

let localizedStrings: { [key: string]: string } | undefined;

export function initLocalization(locale: IOptions) {
  if (localizedStrings) {
    throwError("initLocalization has already been called.");
  }
  // TODO
  localizedStrings = {};
}

export function localize(
  key: string,
  placeholders?: (string | number)[]
): string {
  if (!localizedStrings) {
    throwError("initLocalization has not been called.");
    return key;
  }
  let localizedString = localizedStrings[key];
  if (placeholders) {
    placeholders.forEach((placeholder, index) => {
      localizedString = localizedString.replace(
        new RegExp(`{${index}}`, "g"),
        placeholder.toString()
      );
    });
  }
  return localizedString;
}

/**
 * Remove loaded strings
 */
export function cleanup() {
  localizedStrings = undefined;
}
