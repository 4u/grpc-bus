"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Call = void 0;
const Subject_1 = require("rxjs/Subject");
const _ = require("lodash");
// An ongoing call against a service.
class Call {
    constructor(service, clientId, clientServiceId, callInfo, send) {
        this.service = service;
        this.clientId = clientId;
        this.clientServiceId = clientServiceId;
        this.callInfo = callInfo;
        this.send = send;
        // Subject called when disposed.
        this.disposed = new Subject_1.Subject();
    }
    initCall() {
        if (!this.callInfo || !this.callInfo.methodId) {
            throw new Error('Call info, method ID must be given');
        }
        let args = this.callInfo.binArgument;
        let metadata = undefined;
        if (this.callInfo.meta) {
            try {
                metadata = new this.service.grpc.Metadata();
                this.callInfo.meta.fields.forEach(field => {
                    metadata.set(field.key, field.value);
                });
            }
            catch (ex) {
                throw new Error('Method ' +
                    this.callInfo.methodId +
                    ' has bad metadata. Shold be strictly Record<string, string>.');
            }
        }
        let rpcMeta = this.service.serviceMeta.lookup(this.callInfo.methodId);
        if (!rpcMeta) {
            throw new Error('Method ' + this.callInfo.methodId + ' not found.');
        }
        this.rpcMeta = rpcMeta;
        let camelMethod = _.camelCase(rpcMeta.name);
        if (!this.service.stub[camelMethod] || typeof this.service.stub[camelMethod] !== 'function') {
            throw new Error('Method ' + camelMethod + ' not defined by grpc.');
        }
        if (rpcMeta.requestStream && !rpcMeta.responseStream) {
            this.streamHandle = this.service.stub[camelMethod](metadata, (error, response) => {
                this.handleCallCallback(error, response);
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
            const callback = (error, response) => {
                this.handleCallCallback(error, response);
            };
            if (metadata) {
                this.service.stub[camelMethod](args, metadata, callback);
            }
            else {
                this.service.stub[camelMethod](args, callback);
            }
        }
    }
    write(msg) {
        if (!this.rpcMeta.requestStream ||
            !this.streamHandle ||
            typeof this.streamHandle['write'] !== 'function') {
            return;
        }
        this.streamHandle.write(msg);
    }
    sendEnd() {
        if (!this.rpcMeta.requestStream ||
            !this.streamHandle ||
            typeof this.streamHandle['end'] !== 'function') {
            return;
        }
        this.streamHandle.end();
    }
    dispose() {
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
    }
    handleCallCallback(error, response) {
        if (error) {
            this.callEventHandler('error')(error);
        }
        if (response) {
            this.callEventHandler('data', true)(response);
        }
        this.dispose();
    }
    setCallHandlers(streamHandle) {
        let dataHandler = this.callEventHandler('data', true);
        this.streamHandle.on('data', (data) => {
            dataHandler(data);
        });
        this.streamHandle.on('status', this.callEventHandler('status'));
        this.streamHandle.on('error', this.callEventHandler('error'));
        this.streamHandle.on('end', this.callEventHandler('end'));
    }
    callEventHandler(eventId, isBin = false) {
        return (data) => {
            let callEvent = {
                serviceId: this.clientServiceId,
                callId: this.clientId,
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
            this.send({
                callEvent: callEvent,
            });
        };
    }
}
exports.Call = Call;
//# sourceMappingURL=call.js.map