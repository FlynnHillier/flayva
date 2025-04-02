import { env } from "@/env";
import { UTApi } from "uploadthing/server";

/**
 * The API for upload thing - for interaction by the server.
 */
export const uploadthing = new UTApi();

export const uploadThingFileUrl = (fileKey: string) =>
  new URL(`f/${fileKey}`, `https://${env.UPLOAD_THING_APP_ID}.ufs.sh`).toString();
