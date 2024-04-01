"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameFile = void 0;
const crypto_1 = require("crypto");
const path_1 = require("path");
const renameFile = (originalName) => {
    const fileExtName = (0, path_1.extname)(originalName);
    const randomName = (0, crypto_1.randomUUID)();
    return `${randomName}${fileExtName}`;
};
exports.renameFile = renameFile;
//# sourceMappingURL=rename-file.helper.js.map