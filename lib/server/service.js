"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const Subject_1 = require("rxjs/Subject");
const grpc_1 = require("./grpc");
const _ = require("lodash");
// A stored service.
class Service {
    constructor(protoRoot, clientId, info, 
    // Pass require('@grpc/grpc-js') as an argument.
    grpc) {
        this.protoRoot = protoRoot;
        this.grpc = grpc;
        // Subject called when disposed.
        this.disposed = new Subject_1.Subject();
        this.clientIds = [clientId];
        this.info = info;
    }
    initStub() {
        let serv = this.protoRoot.lookup(this.info.serviceId);
        if (!serv) {
            throw new TypeError(this.info.serviceId + ' was not found.');
        }
        if (!serv.methods || !Object.keys(serv.methods).length) {
            throw new TypeError(this.info.serviceId + ' is not a Service.');
        }
        let stubctr = grpc_1.makePassthroughClientConstructor(this.grpc, serv);
        this.stub = new stubctr(this.info.endpoint, this.grpc.credentials.createInsecure());
        this.serviceMeta = serv;
    }
    clientAdd(id) {
        if (this.clientIds.indexOf(id) === -1) {
            this.clientIds.push(id);
        }
    }
    clientRelease(id) {
        if (!this.clientIds) {
            return;
        }
        this.clientIds = _.without(this.clientIds, id);
        if (this.clientIds.length === 0) {
            this.destroy();
        }
    }
    destroy() {
        this.clientIds = null;
        this.disposed.next(this);
        if (this.stub) {
            this.grpc.getClientChannel(this.stub).close();
        }
        this.stub = null;
        this.info = null;
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map