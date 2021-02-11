"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const Subject_1 = require("rxjs/Subject");
const call_1 = require("./call");
class Service {
    constructor(serviceMeta, clientId, info, promise, send) {
        this.serviceMeta = serviceMeta;
        this.clientId = clientId;
        this.info = info;
        this.promise = promise;
        this.send = send;
        this.disposed = new Subject_1.Subject();
        this.calls = {};
        this.callIdCounter = 1;
        this.serverReleased = false;
        serviceMeta.resolveAll();
    }
    initStub() {
        this.handle = {
            end: () => {
                return this.end();
            },
        };
        for (let methodId in this.serviceMeta.methods) {
            if (!this.serviceMeta.methods.hasOwnProperty(methodId)) {
                continue;
            }
            this.buildStubMethod(this.serviceMeta.methods[methodId]);
        }
    }
    handleCreateResponse(msg) {
        /* istanbul ignore next */
        if (!this.promise) {
            return;
        }
        if (msg.result === 0) {
            this.promise.resolve(this.handle);
            return;
        }
        if (msg.errorDetails) {
            this.promise.reject(msg.errorDetails);
        }
        else {
            this.promise.reject('Error ' + msg.result);
        }
        this.disposed.next(this);
    }
    handleCallCreateResponse(msg) {
        let call = this.calls[msg.callId];
        /* istanbul ignore next */
        if (!call) {
            return;
        }
        call.handleCreateResponse(msg);
    }
    handleCallEnded(msg) {
        let call = this.calls[msg.callId];
        /* istanbul ignore next */
        if (!call) {
            return;
        }
        call.handleEnded(msg);
    }
    handleCallEvent(msg) {
        let call = this.calls[msg.callId];
        /* istanbul ignore next */
        if (!call) {
            return;
        }
        call.handleEvent(msg);
    }
    handleServiceRelease(msg) {
        this.serverReleased = true;
        this.end();
    }
    end() {
        this.dispose();
        return this;
    }
    dispose() {
        for (let callId in this.calls) {
            /* istanbul ignore next */
            if (!this.calls.hasOwnProperty(callId)) {
                continue;
            }
            this.calls[callId].terminate();
        }
        this.calls = {};
        if (!this.serverReleased) {
            this.send({
                serviceRelease: {
                    serviceId: this.clientId,
                },
            });
        }
        this.disposed.next(this);
    }
    buildStubMethod(methodMeta) {
        let methodName = methodMeta.name.charAt(0).toLowerCase() + methodMeta.name.slice(1);
        this.handle[methodName] = (argument, metadata, callback) => {
            if (!callback) {
                if (typeof metadata === 'function') {
                    callback = metadata;
                    metadata = undefined;
                }
                else if (metadata === undefined && typeof argument === 'function') {
                    callback = argument;
                    argument = undefined;
                }
            }
            return this.startCall(methodMeta, argument, metadata, callback);
        };
    }
    startCall(methodMeta, argument, metadata, callback) {
        let callId = this.callIdCounter++;
        let args;
        let meta;
        if (argument) {
            let requestBuilder = methodMeta.resolvedRequestType;
            args = requestBuilder.encode(argument).finish();
        }
        if (metadata) {
            meta = { fields: [] };
            Object.keys(metadata).forEach(key => {
                const value = metadata[key];
                meta.fields.push({ key, value });
            });
            let requestBuilder = methodMeta.resolvedRequestType;
            args = requestBuilder.encode(argument).finish();
        }
        let info = {
            methodId: methodMeta.name,
            binArgument: args,
            meta,
        };
        if (methodMeta.requestStream && argument) {
            throw new Error('Argument should not be specified for a request stream.');
        }
        if (!methodMeta.requestStream && !argument) {
            throw new Error('Argument must be specified for a non-streaming request.');
        }
        if (methodMeta.responseStream && callback) {
            throw new Error('Callback should not be specified for a response stream.');
        }
        if (!methodMeta.responseStream && !callback) {
            throw new Error('Callback should be specified for a non-streaming response.');
        }
        let call = new call_1.Call(callId, this.clientId, info, methodMeta, callback, this.send);
        this.calls[callId] = call;
        call.disposed.subscribe(() => {
            delete this.calls[callId];
        });
        this.send({
            callCreate: {
                callId: callId,
                info: info,
                serviceId: this.clientId,
            },
        });
        return call;
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map