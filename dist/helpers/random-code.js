"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomCode = void 0;
const crypto_1 = require("crypto");
function generateRandomCode(length) {
    const buffer = (0, crypto_1.randomBytes)(length);
    let code = '';
    for (let i = 0; i < length; i++) {
        const digit = buffer[i] % 10;
        code += digit.toString();
    }
    return code;
}
exports.generateRandomCode = generateRandomCode;
//# sourceMappingURL=random-code.js.map