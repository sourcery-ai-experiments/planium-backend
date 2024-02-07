"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyId = void 0;
const common_1 = require("@nestjs/common");
exports.CompanyId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const companyId = request['user'].companyId ?? request.headers['company-id'];
    if (!companyId) {
        throw new common_1.BadRequestException('Company ID not found');
    }
    return request['user'].companyId ?? request.headers['company-id'];
});
//# sourceMappingURL=company-id.decorator.js.map