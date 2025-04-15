import { RequestHandler } from "express";

export type NestedControllerObject = {
  [key: string]: NestedControllerObject | RequestHandler;
};

export type NestedServiceObject = {
  [key: string]:
    | NestedServiceObject
    | ((...args: any[]) => Promise<any>)
    | ((...args: any[]) => any);
};

export type NestedRepositoryObject = {
  [key: string]:
    | NestedRepositoryObject
    | ((...args: any[]) => Promise<any>)
    | ((...args: any[]) => any);
};
