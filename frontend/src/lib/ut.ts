/**
 * This function generates a URL for accessing a file stored in UploadThing using its file key.
 *
 * @param {string} fileKey - The unique key associated with the file in UploadThing.
 * @returns {string} - The complete URL for accessing the file.
 */
export const uploadThingFileUrlFromKey = (fileKey: string) => {
  const appId = import.meta.env.VITE_UPLOAD_THING_APP_ID as string;

  if (!appId) {
    throw new Error("VITE_UPLOAD_THING_APP_ID is not defined");
  }

  return new URL(`f/${fileKey}`, `https://${appId}.ufs.sh`).toString();
};
