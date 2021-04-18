/**
 * Localized string for a specific locale.
 */
export type LocalizationMap = { [key: string]: string };
/**
 * Object containing locale and their localied strings.
 */
export type StringMap = Partial<{ [locale in Locale]: LocalizationMap }>;
/**
 * Array of placeholders.
 */
export type PlaceholderArray = (string | number)[];

/**
 * Locale type.
 */
export type Locale = string;

/**
 * Function used to resolve strings.
 */
export type StringsResolver = (locale: Locale) => Promise<LocalizationMap>;
