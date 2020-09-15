"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Call = void 0;
var Subject_1 = require("rxjs/Subject");
var _ = require("lodash");
// An ongoing call against a service.
var Call = /** @class */ (function () {
    function Call(service, clientId, clientServiceId, callInfo, send) {
        this.service = service;
        this.clientId = clientId;
        this.clientServiceId = clientServiceId;
        this.callInfo = callInfo;
        this.send = send;
        // Subject called when disposed.
        this.disposed = new Subject_1.Subject();
    }
    Call.prototype.initCall = function () {
        var _this = this;
        if (!this.callInfo || !this.callInfo.methodId) {
            throw new Error('Call info, method ID must be given');
        }
        var args = this.callInfo.binArgument;
        var metadata = undefined;
        if (this.callInfo.strMeta) {
            var jsonMeta_1 = JSON.parse(this.callInfo.strMeta);
            metadata = new this.service.grpc.Metadata();
            Object.keys(jsonMeta_1).forEach(function (key) {
                metadata.set(key, jsonMeta_1[key]);
            });
        }
        else {
            throw new Error('Method ' +
                this.callInfo.methodId +
                ' has bad metadata. Shold be strictly Record<string, string>.');
        }
        var rpcMeta = this.service.serviceMeta.lookup(this.callInfo.methodId);
        if (!rpcMeta) {
            throw new Error('Method ' + this.callInfo.methodId + ' not found.');
        }
        this.rpcMeta = rpcMeta;
        var camelMethod = _.camelCase(rpcMeta.name);
        if (!this.service.stub[camelMethod] || typeof this.service.stub[camelMethod] !== 'function') {
            throw new Error('Method ' + camelMethod + ' not defined by grpc.');
        }
        if (rpcMeta.requestStream && !rpcMeta.responseStream) {
            this.streamHandle = this.service.stub[camelMethod](metadata, function (error, response) {
                _this.handleCallCallback(error, response);
            });
            // If they sent some args (shouldn't happen usually) send it off anyway
            if (args) {
                this.streamHandle.write(args);
            }
        }
        else if (rpcMeta.requestStream && rpcMeta.responseStream) {
            this.streamHandle = this.service.stub[camelMethod](metadata);
            this.setCallHandlers(this.streamHandle);
        }
        else if (!rpcMeta.requestStream && rpcMeta.responseStream) {
            this.streamHandle = this.service.stub[camelMethod](args, metadata);
            this.setCallHandlers(this.streamHandle);
        }
        else if (!rpcMeta.requestStream && !rpcMeta.responseStream) {
            if (!args) {
                throw new Error('Method ' +
                    this.callInfo.methodId +
                    ' requires an argument object of type ' +
                    rpcMeta.resolvedRequestType.name + '.');
            }
            this.service.stub[camelMethod](args, metadata, function (error, response) {
                _this.handleCallCallback(error, response);
            });
        }
    };
    Call.prototype.write = function (msg) {
        if (!this.rpcMeta.requestStream ||
            !this.streamHandle ||
            typeof this.streamHandle['write'] !== 'function') {
            return;
        }
        this.streamHandle.write(msg);
    };
    Call.prototype.sendEnd = function () {
        if (!this.rpcMeta.requestStream ||
            !this.streamHandle ||
            typeof this.streamHandle['end'] !== 'function') {
            return;
        }
        this.streamHandle.end();
    };
    Call.prototype.dispose = function () {
        this.send({
            callEnded: {
                callId: this.clientId,
                serviceId: this.clientServiceId,
            },
        });
        if (this.streamHandle && typeof this.streamHandle['end'] === 'function') {
            this.streamHandle.end();
            this.streamHandle = null;
        }
        this.disposed.next(this);
    };
    Call.prototype.handleCallCallback = function (error, response) {
        if (error) {
            this.callEventHandler('error')(error);
        }
        if (response) {
            this.callEventHandler('data', true)(response);
        }
        this.dispose();
    };
    Call.prototype.setCallHandlers = function (streamHandle) {
        var dataHandler = this.callEventHandler('data', true);
        this.streamHandle.on('data', function (data) {
            dataHandler(data);
        });
        this.streamHandle.on('status', this.callEventHandler('status'));
        this.streamHandle.on('error', this.callEventHandler('error'));
        this.streamHandle.on('end', this.callEventHandler('end'));
    };
    Call.prototype.callEventHandler = function (eventId, isBin) {
        var _this = this;
        if (isBin === void 0) { isBin = false; }
        return function (data) {
            var callEvent = {
                serviceId: _this.clientServiceId,
                callId: _this.clientId,
                jsonData: !isBin ? JSON.stringify(data) : undefined,
                binData: isBin ? data : undefined,
                event: eventId,
            };
            if (!callEvent.jsonData) {
                delete callEvent.jsonData;
            }
            if (!callEvent.binData) {
                delete callEvent.binData;
            }
            _this.send({
                callEvent: callEvent,
            });
        };
    };
    return Call;
}());
exports.Call = Call;
//# sourceMappingURL=call.js.map