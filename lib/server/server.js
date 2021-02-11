"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const store_1 = require("./store");
const call_store_1 = require("./call_store");
// A server for a remote client.
class Server {
    constructor(protoRoot, send, 
    // Pass require('@grpc/grpc-js')
    grpc) {
        this.protoRoot = protoRoot;
        this.send = send;
        this.grpc = grpc;
        // Map of known client IDs to services.
        this.clientIdToService = {};
        this.store = new store_1.ServiceStore(protoRoot, this.grpc);
    }
    handleMessage(message) {
        if (message.serviceCreate) {
            this.handleServiceCreate(message.serviceCreate);
        }
        if (message.serviceRelease) {
            this.handleServiceRelease(message.serviceRelease);
        }
        if (message.callCreate) {
            this.handleCallCreate(message.callCreate);
        }
        if (message.callEnd) {
            this.handleCallEnd(message.callEnd);
        }
        if (message.callSend) {
            this.handleCallSend(message.callSend);
        }
    }
    dispose() {
        for (let servId in this.clientIdToService) {
            if (!this.clientIdToService.hasOwnProperty(servId)) {
                continue;
            }
            this.clientIdToService[servId].dispose();
        }
        this.clientIdToService = {};
    }
    releaseLocalService(serviceId, sendGratuitous = true) {
        let srv = this.clientIdToService[serviceId];
        if (srv) {
            sendGratuitous = true;
            // Kill all ongoing calls, inform the client they are ended
            delete this.clientIdToService[serviceId];
            srv.dispose();
        }
        if (sendGratuitous) {
            // Inform the client the service has been released
            this.send({
                serviceRelease: {
                    serviceId: serviceId,
                },
            });
        }
    }
    handleServiceCreate(msg) {
        let serviceId = msg.serviceId;
        let result = {
            serviceId: msg.serviceId,
            result: 0,
        };
        if (typeof msg.serviceId !== 'number' || this.clientIdToService[msg.serviceId]) {
            // todo: fix enums
            result.result = 1;
            result.errorDetails = 'ID is not set or is already in use.';
        }
        else {
            try {
                let serv = this.store.getService(msg.serviceId, msg.serviceInfo);
                // Here, we may get an error thrown if the info is invalid.
                serv.initStub();
                // When the service is disposed, also dispose the client service.
                serv.disposed.subscribe(() => {
                    this.releaseLocalService(serviceId, false);
                });
                this.clientIdToService[serviceId] = new call_store_1.CallStore(serv, msg.serviceId, this.send);
            }
            catch (e) {
                result.result = 2;
                result.errorDetails = e.toString();
            }
        }
        this.send({
            serviceCreate: result,
        });
    }
    handleServiceRelease(msg) {
        this.releaseLocalService(msg.serviceId);
    }
    handleCallSend(msg) {
        let svc = this.clientIdToService[msg.serviceId];
        if (!svc) {
            this.releaseLocalService(msg.serviceId, true);
            return;
        }
        svc.handleCallWrite(msg);
    }
    handleCallCreate(msg) {
        let svc = this.clientIdToService[msg.serviceId];
        if (!svc) {
            this.send({
                callCreate: {
                    result: 1,
                    serviceId: msg.serviceId,
                    callId: msg.callId,
                    errorDetails: 'Service ID not found.',
                },
            });
            return;
        }
        svc.initCall(msg);
    }
    handleCallEnd(msg) {
        let svc = this.clientIdToService[msg.serviceId];
        if (svc) {
            svc.handleCallEnd(msg);
        }
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map