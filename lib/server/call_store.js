"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallStore = void 0;
const call_1 = require("./call");
// Store of all active calls for a client service.
class CallStore {
    constructor(service, clientId, send) {
        this.service = service;
        this.clientId = clientId;
        this.send = send;
        this.calls = {};
    }
    initCall(msg) {
        let result = {
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
                let callId = msg.callId;
                let call = new call_1.Call(this.service, msg.callId, msg.serviceId, msg.info, this.send);
                call.initCall();
                this.calls[msg.callId] = call;
                call.disposed.subscribe(() => {
                    this.releaseLocalCall(callId);
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
    }
    handleCallEnd(msg) {
        let call = this.calls[msg.callId];
        if (!call) {
            return;
        }
        call.dispose();
    }
    handleCallWrite(msg) {
        let call = this.calls[msg.callId];
        if (!call) {
            return;
        }
        if (msg.isEnd) {
            call.sendEnd();
        }
        else {
            call.write(msg.binData);
        }
    }
    releaseLocalCall(id) {
        delete this.calls[id];
    }
    // Kill all ongoing calls, cleanup.
    dispose() {
        for (let callId in this.calls) {
            if (!this.calls.hasOwnProperty(callId)) {
                continue;
            }
            this.calls[callId].dispose();
        }
        this.service.clientRelease(this.clientId);
        this.calls = {};
    }
}
exports.CallStore = CallStore;
//# sourceMappingURL=call_store.js.map