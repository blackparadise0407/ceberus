import { Cursor } from 'typeorm-cursor-pagination';

declare global {
  interface KeyValue {
    [key: string]: any | KeyValue;
  }

  interface BaseQuery extends Cursor {
    limit: number;
  }
}

export {};
