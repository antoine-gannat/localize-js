import { error, log, throwError } from "./logger";

export interface IOptions {
  /**
   * Language requested.
   * Usually looking like "en" or "en_US".
   */
  locale: string;
  /**
   * Path of the folder where the localized strings will be fetched from.
   */
  localizedStringsPath: string;
}

let localizedStrings: { [key: string]: string } | undefined;
let options: IOptions | undefined;

function loadLocale(locale: string, folderPath: string): Promise<void> {
  // lazy load the strings
  return import(`${folderPath}/${locale}_strings.json`).then(
    (content) => (localizedStrings = content.default)
  );
}

/**
 * Convert a locale of type "en_US" to "en" with additional checks for case.
 * @param locale Locale to parse
 * @returns A parsed locale that matches the SupportedLocale format
 */
function parseLocale(locale: string): string {
  // lowercase and convert "_" to "-"
  let parsedLocale = locale.toLowerCase().replace(/_/g, "-");
  // remove everything following a "-" if found
  const dashIndex = parsedLocale.indexOf("-");
  if (dashIndex >= 0) {
    parsedLocale = parsedLocale.slice(0, dashIndex);
  }

  return parsedLocale;
}

export function initLocalization(localizationOptions: IOptions): Promise<void> {
  if (localizedStrings || !localizationOptions) {
    throwError("initLocalization has already been called.");
  }
  log("init");
  options = localizationOptions;
  options.locale = parseLocale(options.locale);
  const { locale, localizedStringsPath } = options;
  return loadLocale(locale, localizedStringsPath).catch((e) =>
    error("Failed to load locale for " + locale + " " + e)
  );
}

/**
 * Find and return a localized sentence based on the key provided.
 * @param key Key representing a localized string.
 * @param placeholders (Optional) Array of strings or numbers that can be dynamically inserted to a localized string.
 * @returns A localized string.
 *
 * Example:
 *
 * Localized string: "This is a localized english string, the date is {0}.".
 * JS code: localize("testString", ["January 1st"]).
 *
 * Returned string: "This is a localized english string, the date is January 1st."
 */
export function localize(
  key: string,
  placeholders?: (string | number)[]
): string {
  if (!localizedStrings) {
    throwError("initLocalization has not been called.");
    return key;
  }
  let localizedString = localizedStrings[key];
  // if placeholders are present, use them to replace values in the string.
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
  options = undefined;
}
