"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
var store_1 = require("./store");
var call_store_1 = require("./call_store");
// A server for a remote client.
var Server = /** @class */ (function () {
    function Server(protoRoot, send, 
    // Pass require('@grpc/grpc-js')
    grpc) {
        this.protoRoot = protoRoot;
        this.send = send;
        this.grpc = grpc;
        // Map of known client IDs to services.
        this.clientIdToService = {};
        this.store = new store_1.ServiceStore(protoRoot, this.grpc);
    }
    Server.prototype.handleMessage = function (message) {
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
    };
    Server.prototype.dispose = function () {
        for (var servId in this.clientIdToService) {
            if (!this.clientIdToService.hasOwnProperty(servId)) {
                continue;
            }
            this.clientIdToService[servId].dispose();
        }
        this.clientIdToService = {};
    };
    Server.prototype.releaseLocalService = function (serviceId, sendGratuitous) {
        if (sendGratuitous === void 0) { sendGratuitous = true; }
        var srv = this.clientIdToService[serviceId];
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
    };
    Server.prototype.handleServiceCreate = function (msg) {
        var _this = this;
        var serviceId = msg.serviceId;
        var result = {
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
                var serv = this.store.getService(msg.serviceId, msg.serviceInfo);
                // Here, we may get an error thrown if the info is invalid.
                serv.initStub();
                // When the service is disposed, also dispose the client service.
                serv.disposed.subscribe(function () {
                    _this.releaseLocalService(serviceId, false);
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
    };
    Server.prototype.handleServiceRelease = function (msg) {
        this.releaseLocalService(msg.serviceId);
    };
    Server.prototype.handleCallSend = function (msg) {
        var svc = this.clientIdToService[msg.serviceId];
        if (!svc) {
            this.releaseLocalService(msg.serviceId, true);
            return;
        }
        svc.handleCallWrite(msg);
    };
    Server.prototype.handleCallCreate = function (msg) {
        var svc = this.clientIdToService[msg.serviceId];
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
    };
    Server.prototype.handleCallEnd = function (msg) {
        var svc = this.clientIdToService[msg.serviceId];
        if (svc) {
            svc.handleCallEnd(msg);
        }
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map