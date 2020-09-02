"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallStore = void 0;
var call_1 = require("./call");
// Store of all active calls for a client service.
var CallStore = /** @class */ (function () {
    function CallStore(service, clientId, send) {
        this.service = service;
        this.clientId = clientId;
        this.send = send;
        this.calls = {};
    }
    CallStore.prototype.initCall = function (msg) {
        var _this = this;
        var result = {
            callId: msg.callId,
            serviceId: msg.serviceId,
            result: 0,
        };
        if (typeof msg.callId !== 'number' || this.calls[msg.callId]) {
            // todo: fix enums
            result.result = 1;
            result.errorDetails = 'ID is not set or is already in use.';
        }
        else {
            try {
                var callId_1 = msg.callId;
                var call = new call_1.Call(this.service, msg.callId, msg.serviceId, msg.info, this.send);
                call.initCall();
                this.calls[msg.callId] = call;
                call.disposed.subscribe(function () {
                    _this.releaseLocalCall(callId_1);
                });
            }
            catch (e) {
                result.result = 2;
                result.errorDetails = e.toString();
            }
        }
        this.send({
            callCreate: result,
        });
    };
    CallStore.prototype.handleCallEnd = function (msg) {
        var call = this.calls[msg.callId];
        if (!call) {
            return;
        }
        call.dispose();
    };
    CallStore.prototype.handleCallWrite = function (msg) {
        var call = this.calls[msg.callId];
        if (!call) {
            return;
        }
        if (msg.isEnd) {
            call.sendEnd();
        }
        else {
            call.write(msg.binData);
        }
    };
    CallStore.prototype.releaseLocalCall = function (id) {
        delete this.calls[id];
    };
    // Kill all ongoing calls, cleanup.
    CallStore.prototype.dispose = function () {
        for (var callId in this.calls) {
            if (!this.calls.hasOwnProperty(callId)) {
                continue;
            }
            this.calls[callId].dispose();
        }
        this.service.clientRelease(this.clientId);
        this.calls = {};
    };
    return CallStore;
}());
exports.CallStore = CallStore;
//# sourceMappingURL=call_store.js.map