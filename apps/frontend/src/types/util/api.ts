export type ApiObject = {
  [key: string]: ApiObject | ((...args: any[]) => Promise<any>);
};
