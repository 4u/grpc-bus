import { IGBCallInfo, IGBCreateCallResult, IGBCallEvent, IGBCallEnded, IGBClientMessage } from '../proto';
import { Subject } from 'rxjs/Subject';
export interface ICallHandle {
    write?(msg: any): void;
    on?(eventId: string, callback: (arg: any) => void): void;
    off?(eventId: string): void;
    end?(): void;
    terminate?(): void;
}
export declare class Call implements ICallHandle {
    clientId: number;
    clientServiceId: number;
    private info;
    private callMeta;
    private callback;
    private send;
    disposed: Subject<Call>;
    private eventHandlers;
    private endEmitted;
    private responseBuilder;
    private requestBuilder;
    constructor(clientId: number, clientServiceId: number, info: IGBCallInfo, callMeta: import('protobufjs').Method, callback: (error?: any, response?: any) => void, send: (message: IGBClientMessage) => void);
    on(eventId: string, callback: (arg: any) => void): void;
    off(eventId: string): void;
    handleCreateResponse(msg: IGBCreateCallResult): void;
    handleEnded(msg: IGBCallEnded): void;
    handleEvent(msg: IGBCallEvent): void;
    end(): void;
    terminate(): void;
    write(msg: any): void;
    dispose(): void;
    private decodeResponseData;
    private terminateWithError;
    private terminateWithData;
    private emit;
}
