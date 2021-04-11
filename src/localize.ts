import { Locale, StringMap, LocalizationMap, PlaceholderArray } from "./types";

/**
 * Options used to create the Localize class
 */
export interface ILocalizeOptions {
  /**
   * Language requested.
   */
  locale: Locale;

  /**
   * Path of the folder where the localized strings will be fetched from.
   *
   * The files inside that folder must follow the format: {locale}_strings.json.
   * Their content must follow this format:
   * {
   *    "myStringKey": "My string content",
   *    "someOtherStringWithPalceholder": "This is a placeholder: {0}. ",
   * }
   */
  stringsFolder?: string;

  /**
   *
   */
  stringMap?: StringMap;
}

export class Localize {
  private strings: LocalizationMap = {};
  private initialized: boolean = false;
  private options: ILocalizeOptions;
  constructor(options: ILocalizeOptions) {
    this.options = {
      ...options,
      // set by default locale to lowercase to avoid any case issues.
      locale: options.locale.toLowerCase(),
    };
  }

  /**
   * Take a string and replace some of its content.
   * @param rawString A string containing text and tokens like theses: {0} {1} {...}
   * @param placeholders Array of values that will be used to replace the string tokens.
   */
  private applyPlaceholders(
    rawString: string,
    placeholders: PlaceholderArray
  ): string {
    let stringWithPlaceholders = rawString;
    placeholders.forEach((placeholder, index) => {
      stringWithPlaceholders = stringWithPlaceholders.replace(
        new RegExp(`\\{${index}\\}`, "g"),
        placeholder.toString()
      );
    });
    return stringWithPlaceholders;
  }

  private lazyLoadLocale(locale: Locale, path: string): Promise<void> {
    // lazy load the strings
    return import(`${path}/${locale}_strings.json`).then(
      (content) => (this.strings = content.default)
    );
  }

  private loadStringsFromLocaleMap(
    locale: Locale,
    stringMap: StringMap
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const strings = stringMap[locale];
      if (strings) {
        this.strings = strings;
        resolve();
      } else {
        reject(
          `Could not find locale ${locale} in provided ILocalizeOptions.stringMap.`
        );
      }
    });
  }

  /**
   * Load the localized strings for the specified locale.
   * @returns An empty promise when the loading is completed
   */
  public init(): Promise<void> {
    const { stringMap, stringsFolder, locale } = this.options;
    if (this.initialized) {
      return Promise.reject("Localize.init has already been called.");
    }
    this.initialized = true;
    // If the strings are directly provided
    if (stringMap) {
      return this.loadStringsFromLocaleMap(locale, stringMap);
    } else if (stringsFolder) {
      return this.lazyLoadLocale(locale, stringsFolder);
    }
    // on fail, reset initialized.
    this.initialized = false;
    return Promise.reject(
      "Could not find any strings. Please specify either ILocalizeOptions.stringMap or ILocalizeOptions.stringsPath."
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
  public localize(key: string, placeholders?: PlaceholderArray): string {
    if (!this.initialized) {
      throw Error("init has not been called.");
    }
    const localizedString = this.strings[key];
    // if placeholders are present, use them to replace values in the string.
    return placeholders
      ? this.applyPlaceholders(localizedString, placeholders)
      : localizedString;
  }
}
