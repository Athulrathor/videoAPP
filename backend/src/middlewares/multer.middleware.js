import multer, { memoryStorage } from "multer";
import path from 'path';

const tempDir = path.join(process.cwd(), 'public', 'temp');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});

export const upload = multer({
    storage,
});