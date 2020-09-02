"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Call = void 0;
var Subject_1 = require("rxjs/Subject");
var Call = /** @class */ (function () {
    function Call(clientId, clientServiceId, info, callMeta, callback, send) {
        this.clientId = clientId;
        this.clientServiceId = clientServiceId;
        this.info = info;
        this.callMeta = callMeta;
        this.callback = callback;
        this.send = send;
        this.disposed = new Subject_1.Subject();
        this.eventHandlers = {};
        this.endEmitted = false;
        this.requestBuilder = callMeta.resolvedRequestType;
        this.responseBuilder = callMeta.resolvedResponseType;
    }
    Call.prototype.on = function (eventId, callback) {
        var handlers = this.eventHandlers[eventId];
        if (!handlers) {
            handlers = [];
            this.eventHandlers[eventId] = handlers;
        }
        handlers.push(callback);
    };
    Call.prototype.off = function (eventId) {
        delete this.eventHandlers[eventId];
    };
    Call.prototype.handleCreateResponse = function (msg) {
        if (msg.result === 0) {
            return;
        }
        if (msg.errorDetails && msg.errorDetails.length) {
            this.terminateWithError(msg.errorDetails);
        }
        else {
            this.terminateWithError('Error ' + msg.result);
        }
    };
    Call.prototype.handleEnded = function (msg) {
        this.dispose();
    };
    Call.prototype.handleEvent = function (msg) {
        var data = null;
        if (msg.jsonData && msg.jsonData.length) {
            data = JSON.parse(msg.jsonData);
        }
        else if (msg.binData && msg.binData.length) {
            data = this.decodeResponseData(msg.binData);
        }
        this.emit(msg.event, data);
        if (this.callback) {
            if (msg.event === 'error') {
                this.terminateWithError(data);
            }
            else if (msg.event === 'data') {
                this.terminateWithData(data);
            }
        }
    };
    Call.prototype.end = function () {
        this.send({
            callSend: {
                callId: this.clientId,
                serviceId: this.clientServiceId,
                isEnd: true,
            },
        });
    };
    Call.prototype.terminate = function () {
        this.send({
            callEnd: {
                callId: this.clientId,
                serviceId: this.clientServiceId,
            },
        });
        this.dispose();
    };
    Call.prototype.write = function (msg) {
        if (!this.callMeta.requestStream) {
            throw new Error('Cannot write to a non-streaming request.');
        }
        if (typeof msg !== 'object') {
            throw new Error('Can only write objects to streaming requests.');
        }
        this.send({
            callSend: {
                callId: this.clientId,
                serviceId: this.clientServiceId,
                binData: this.requestBuilder.encode(msg).finish(),
            },
        });
    };
    Call.prototype.dispose = function () {
        if (!this.endEmitted) {
            this.emit('end', null);
        }
        this.disposed.next(this);
    };
    Call.prototype.decodeResponseData = function (data) {
        return this.responseBuilder.decode(data);
    };
    Call.prototype.terminateWithError = function (error) {
        if (this.callback) {
            this.callback(error, null);
        }
        else {
            this.emit('error', error);
        }
        this.dispose();
    };
    Call.prototype.terminateWithData = function (data) {
        this.callback(null, data);
        this.dispose();
    };
    Call.prototype.emit = function (eventId, arg) {
        if (eventId === 'end') {
            this.endEmitted = true;
        }
        var handlers = this.eventHandlers[eventId];
        if (!handlers) {
            return;
        }
        for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
            var handler = handlers_1[_i];
            handler(arg);
        }
    };
    return Call;
}());
exports.Call = Call;
//# sourceMappingURL=call.js.map