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

  test("init and localize", async () => {
    const localization = new Localize(mockOptions);
    await localization.init();
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

  test("initLocalization not called", () => {
    const localization = new Localize(mockOptions);
    expect(() => localization.localize("test")).toThrow();
  });

  test("initLocalization called twice", async () => {
    const localization = new Localize(mockOptions);

    // should not fail
    await localization.init();
    // should fail
    return localization
      .init()
      .then(() => fail("Double init did not fail."))
      .catch(() => {});
  });

  test("Invalid locale", () => {
    const localization = new Localize({
      ...mockOptions,
      locale: "invalid-locale",
    });
    return (
      localization
        .init()
        .then(() => fail("Invalid locale did not fail."))
        // swallow the error since we expect the promise to fail.
        .catch(() => {})
    );
  });
});
