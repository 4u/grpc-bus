"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
var Subject_1 = require("rxjs/Subject");
var call_1 = require("./call");
var Service = /** @class */ (function () {
    function Service(serviceMeta, clientId, info, promise, send) {
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
    Service.prototype.initStub = function () {
        var _this = this;
        this.handle = {
            end: function () {
                return _this.end();
            },
        };
        for (var methodId in this.serviceMeta.methods) {
            if (!this.serviceMeta.methods.hasOwnProperty(methodId)) {
                continue;
            }
            this.buildStubMethod(this.serviceMeta.methods[methodId]);
        }
    };
    Service.prototype.handleCreateResponse = function (msg) {
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
    };
    Service.prototype.handleCallCreateResponse = function (msg) {
        var call = this.calls[msg.callId];
        /* istanbul ignore next */
        if (!call) {
            return;
        }
        call.handleCreateResponse(msg);
    };
    Service.prototype.handleCallEnded = function (msg) {
        var call = this.calls[msg.callId];
        /* istanbul ignore next */
        if (!call) {
            return;
        }
        call.handleEnded(msg);
    };
    Service.prototype.handleCallEvent = function (msg) {
        var call = this.calls[msg.callId];
        /* istanbul ignore next */
        if (!call) {
            return;
        }
        call.handleEvent(msg);
    };
    Service.prototype.handleServiceRelease = function (msg) {
        this.serverReleased = true;
        this.end();
    };
    Service.prototype.end = function () {
        this.dispose();
        return this;
    };
    Service.prototype.dispose = function () {
        for (var callId in this.calls) {
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
    };
    Service.prototype.buildStubMethod = function (methodMeta) {
        var _this = this;
        var methodName = methodMeta.name.charAt(0).toLowerCase() + methodMeta.name.slice(1);
        this.handle[methodName] = function (argument, metadata, callback) {
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
            return _this.startCall(methodMeta, argument, metadata, callback);
        };
    };
    Service.prototype.startCall = function (methodMeta, argument, metadata, callback) {
        var _this = this;
        var callId = this.callIdCounter++;
        var args;
        if (argument) {
            var requestBuilder = methodMeta.resolvedRequestType;
            args = requestBuilder.encode(argument).finish();
        }
        var info = {
            methodId: methodMeta.name,
            binArgument: args,
            strMeta: metadata ? JSON.stringify(metadata) : undefined,
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
        var call = new call_1.Call(callId, this.clientId, info, methodMeta, callback, this.send);
        this.calls[callId] = call;
        call.disposed.subscribe(function () {
            delete _this.calls[callId];
        });
        this.send({
            callCreate: {
                callId: callId,
                info: info,
                serviceId: this.clientId,
            },
        });
        return call;
    };
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=service.js.map