declare global {
  interface KeyValue {
    [key: string]: any | KeyValue;
  }
}

export {};
