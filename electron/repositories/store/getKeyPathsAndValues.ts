import { AnyObject } from '@shared/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getKeyPathsAndValues(obj: AnyObject): [path: string, value: any][] {
  return Object.entries(obj).reduce<ReturnType<typeof getKeyPathsAndValues>>(
    (acc, [key, value]) => {
      if (isObject(value)) {
        getKeyPathsAndValues(value).forEach(([nestedKey, nestedValue]) =>
          acc.push([`${key}.${nestedKey}`, nestedValue])
        );
      } else {
        acc.push([key, value]);
      }
      return acc;
    },
    []
  );
}

function isObject(maybeObj: unknown): maybeObj is AnyObject {
  return (
    !(maybeObj === null || maybeObj === undefined || Array.isArray(maybeObj)) &&
    typeof maybeObj === 'object'
  );
}
