"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceStore = void 0;
const service_info_1 = require("./service_info");
const service_1 = require("./service");
// A store of active services.
class ServiceStore {
    constructor(protoRoot, grpc) {
        this.protoRoot = protoRoot;
        this.grpc = grpc;
        this.services = {};
    }
    // Get service for a client.
    getService(clientId, info) {
        let identifier = service_info_1.buildServiceInfoIdentifier(info);
        let serv = this.services[identifier];
        if (!serv) {
            serv = new service_1.Service(this.protoRoot, clientId, info, this.grpc);
            serv.disposed.subscribe(() => {
                if (this.services) {
                    delete this.services[identifier];
                }
            });
            this.services[identifier] = serv;
        }
        else {
            serv.clientAdd(clientId);
        }
        return serv;
    }
}
exports.ServiceStore = ServiceStore;
//# sourceMappingURL=store.js.map