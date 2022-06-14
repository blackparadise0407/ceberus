import { camelCase } from 'lodash';

export const mapRawQueryToEntity = <T>(
  rawQuery: unknown = {},
  exclude: string[] = [],
) => {
  return Object.keys(rawQuery).reduce((seen, key) => {
    const [prefix, ...rest] = key.split('_');
    if (exclude.includes(key) || !rest.length) {
      seen[key] = rawQuery[key];
      return seen as T;
    }
    if (!seen[prefix]) {
      seen[prefix] = {};
    }
    seen[prefix][camelCase(rest.join('_'))] = rawQuery[key];
    return seen as T;
  }, {});
};

export const mapRawQueryToEntities = <T>(
  rawQueries: unknown[] = [],
  exclude: string[] = [],
) => {
  return rawQueries.map((query) => mapRawQueryToEntity(query, exclude)) as T[];
};
