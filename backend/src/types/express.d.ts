import { User as UserType } from "@flayva-monorepo/shared/types";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}
