import { initLocalization, localize, IOptions, cleanup } from "../index";

const mockOptions: IOptions = {
  locale: "en",
  localizedStringsPath: ".",
};

describe("Main unit tests", () => {
  afterEach(() => cleanup());

  test("initLocalization and localize", () => {
    initLocalization(mockOptions);
    expect(() => localize("")).not.toThrow();
  });

  test("initLocalization not called", () => {
    expect(() => localize("")).toThrow();
  });

  test("initLocalization called twice", () => {
    expect(() => initLocalization(mockOptions)).not.toThrow();
    expect(() => initLocalization(mockOptions)).toThrow();
  });
});
