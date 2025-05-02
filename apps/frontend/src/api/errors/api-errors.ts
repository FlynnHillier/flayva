import { NoRetryQueryError } from "@/lib/query";

export class UnexpectedResponseFormatError extends NoRetryQueryError {
  /**
   * @param routeName - The name of the route that was called
   * @param recieved - The response that was recieved
   */
  constructor(routeName: string, recieved: any) {
    super(`'${routeName}', recieved unexpected response format: ${JSON.stringify(recieved)}`);
  }
}
