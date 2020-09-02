"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ECreateCallResult = exports.ECreateServiceResult = void 0;
var ECreateServiceResult;
(function (ECreateServiceResult) {
    ECreateServiceResult[ECreateServiceResult["SUCCESS"] = 0] = "SUCCESS";
    ECreateServiceResult[ECreateServiceResult["INVALID_ID"] = 1] = "INVALID_ID";
    ECreateServiceResult[ECreateServiceResult["GRPC_ERROR"] = 2] = "GRPC_ERROR";
})(ECreateServiceResult = exports.ECreateServiceResult || (exports.ECreateServiceResult = {}));
var ECreateCallResult;
(function (ECreateCallResult) {
    ECreateCallResult[ECreateCallResult["SUCCESS"] = 0] = "SUCCESS";
    ECreateCallResult[ECreateCallResult["INVALID_ID"] = 1] = "INVALID_ID";
    ECreateCallResult[ECreateCallResult["GRPC_ERROR"] = 2] = "GRPC_ERROR";
})(ECreateCallResult = exports.ECreateCallResult || (exports.ECreateCallResult = {}));
//# sourceMappingURL=interfaces.js.map