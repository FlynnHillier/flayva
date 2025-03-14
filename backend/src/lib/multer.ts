import multer from "multer";

export const multerupload = multer({ storage: multer.memoryStorage() });
