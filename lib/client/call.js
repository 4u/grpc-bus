"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Call = void 0;
const Subject_1 = require("rxjs/Subject");
class Call {
    constructor(clientId, clientServiceId, info, callMeta, callback, send) {
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
    on(eventId, callback) {
        let handlers = this.eventHandlers[eventId];
        if (!handlers) {
            handlers = [];
            this.eventHandlers[eventId] = handlers;
        }
        handlers.push(callback);
    }
    off(eventId) {
        delete this.eventHandlers[eventId];
    }
    handleCreateResponse(msg) {
        if (msg.result === 0) {
            return;
        }
        if (msg.errorDetails && msg.errorDetails.length) {
            this.terminateWithError(msg.errorDetails);
        }
        else {
            this.terminateWithError('Error ' + msg.result);
        }
    }
    handleEnded(msg) {
        this.dispose();
    }
    handleEvent(msg) {
        let data = null;
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
    }
    end() {
        this.send({
            callSend: {
                callId: this.clientId,
                serviceId: this.clientServiceId,
                isEnd: true,
            },
        });
    }
    terminate() {
        this.send({
            callEnd: {
                callId: this.clientId,
                serviceId: this.clientServiceId,
            },
        });
        this.dispose();
    }
    write(msg) {
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
    }
    dispose() {
        if (!this.endEmitted) {
            this.emit('end', null);
        }
        this.disposed.next(this);
    }
    decodeResponseData(data) {
        return this.responseBuilder.decode(data);
    }
    terminateWithError(error) {
        if (this.callback) {
            this.callback(error, null);
        }
        else {
            this.emit('error', error);
        }
        this.dispose();
    }
    terminateWithData(data) {
        this.callback(null, data);
        this.dispose();
    }
    emit(eventId, arg) {
        if (eventId === 'end') {
            this.endEmitted = true;
        }
        let handlers = this.eventHandlers[eventId];
        if (!handlers) {
            return;
        }
        for (let handler of handlers) {
            handler(arg);
        }
    }
}
exports.Call = Call;
//# sourceMappingURL=call.js.map