export abstract class AuthError extends Error {}

export class UserNotFoundError extends AuthError {
  constructor() {
    super("User not found");
  }
}
