import { User as PassportUser } from "passport";

declare global {
  namespace Express {
    interface User extends PassportUser {
      id: number;
      email: string | null;
      username: string;
    }
  }
}
