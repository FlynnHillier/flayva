import fs from "fs/promises";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Path to the data folder
 */
export const DATA_FOLDER_PATH = path.join(__dirname, "../data");

/**
 * Check if a file exists
 * @param fp Filepath
 */
export const fileExists = async (fp: string) => !!(await fs.stat(fp).catch((err) => false));
