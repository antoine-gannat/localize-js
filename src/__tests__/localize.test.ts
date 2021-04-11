import { Localize } from "../";
import { ILocalizeOptions } from "../localize";

describe("Main unit tests", () => {
  const simpleString = { key: "test", value: "cool string" };
  const placeholderString = {
    key: "testWithPlaceholder",
    value: "cool {0}",
    placeholders: ["string"],
    valueWithPlaceholder: "cool string",
  };

  const mockOptions: ILocalizeOptions = {
    locale: "en-us",
    stringMap: {
      "en-us": {
        [simpleString.key]: simpleString.value,
        [placeholderString.key]: placeholderString.value,
      },
    },
  };

  test("init and localize", () => {
    const localization = new Localize(mockOptions);
    return localization.init().then(() => {
      // test using simple string
      expect(localization.localize(simpleString.key)).toBe(simpleString.value);
      // test using placeholders
      expect(
        localization.localize(
          placeholderString.key,
          placeholderString.placeholders
        )
      ).toBe(placeholderString.valueWithPlaceholder);
    });
  });

  test("initLocalization not called", () => {
    const localization = new Localize(mockOptions);
    expect(() => localization.localize("test")).toThrow();
  });

  test("initLocalization called twice", () => {
    const localization = new Localize(mockOptions);
    expect(() => localization.init()).not.toThrow();
    expect(() => localization.init()).toThrow();
  });
});
