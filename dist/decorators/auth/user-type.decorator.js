"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypes = exports.USER_TYPE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.USER_TYPE_KEY = 'userType';
const UserTypes = (...userTypes) => (0, common_1.SetMetadata)(exports.USER_TYPE_KEY, userTypes);
exports.UserTypes = UserTypes;
//# sourceMappingURL=user-type.decorator.js.map