"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregateByCompany = exports.findByCompany = void 0;
function findByCompany(companyId, conditions) {
    return this.find({ ...conditions, companyId });
}
exports.findByCompany = findByCompany;
function aggregateByCompany(companyId, pipeline) {
    const companyPipeline = [{ $match: { companyId } }, ...pipeline];
    return this.aggregate(companyPipeline);
}
exports.aggregateByCompany = aggregateByCompany;
//# sourceMappingURL=index.js.map