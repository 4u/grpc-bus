"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceStore = void 0;
var service_info_1 = require("./service_info");
var service_1 = require("./service");
// A store of active services.
var ServiceStore = /** @class */ (function () {
    function ServiceStore(protoRoot, grpc) {
        this.protoRoot = protoRoot;
        this.grpc = grpc;
        this.services = {};
    }
    // Get service for a client.
    ServiceStore.prototype.getService = function (clientId, info) {
        var _this = this;
        var identifier = service_info_1.buildServiceInfoIdentifier(info);
        var serv = this.services[identifier];
        if (!serv) {
            serv = new service_1.Service(this.protoRoot, clientId, info, this.grpc);
            serv.disposed.subscribe(function () {
                if (_this.services) {
                    delete _this.services[identifier];
                }
            });
            this.services[identifier] = serv;
        }
        else {
            serv.clientAdd(clientId);
        }
        return serv;
    };
    return ServiceStore;
}());
exports.ServiceStore = ServiceStore;
//# sourceMappingURL=store.js.map