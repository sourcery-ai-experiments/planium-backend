"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskType = exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TO_DO"] = "TO_DO";
    TaskStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TaskStatus["WAITING_APPROVAL"] = "WAITING_APPROVAL";
    TaskStatus["DONE"] = "DONE";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskType;
(function (TaskType) {
    TaskType["HOURS"] = "HOURS";
    TaskType["PRODUCTION"] = "PRODUCTION";
})(TaskType || (exports.TaskType = TaskType = {}));
//# sourceMappingURL=Task.js.map