import { User as PassportUser } from "passport";
import { User as UserType } from "@flayva-monorepo/shared";

declare global {
  namespace Express {
    interface User extends PassportUser, UserType {}
  }
}
