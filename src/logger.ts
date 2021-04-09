import { name as packageName } from "../package.json";

export function throwError(message: string) {
  throw Error(`${packageName}: ${message}`);
}

export function log(message: any) {
  console.log(`${packageName}:`, message);
}

export function error(message: any) {
  console.error(`${packageName}:`, message);
}

export function warn(message: any) {
  console.warn(`${packageName}:`, message);
}
