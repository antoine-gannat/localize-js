import { throwError } from "../logger";

test("logger.throwError", () => {
  const message = "This is an error";
  expect(() => throwError("This is an error")).toThrow(message);
});
