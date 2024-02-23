"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorFilter = void 0;
const errorFilter = async (error, c) => {
    var _a, _b;
    return c.json({
        status: (_a = error.status) !== null && _a !== void 0 ? _a : 500,
        message: (_b = error.message) !== null && _b !== void 0 ? _b : 'Something went wrong',
    }, error.status);
};
exports.errorFilter = errorFilter;
//# sourceMappingURL=error-filter.js.map