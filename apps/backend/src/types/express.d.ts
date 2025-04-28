import { type User as UserType } from "@flayva/types";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}
