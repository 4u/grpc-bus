import { IGBCallInfo, IGBCreateCallResult, IGBCallEvent, IGBCallEnded, IGBClientMessage } from '../proto';
import { Status } from '../types';
import { Subject } from 'rxjs/Subject';
export interface ICallHandle {
    write?(msg: any): void;
    on?(eventId: string, callback: (arg: any) => void): void;
    off?(eventId: string): void;
    end?(): void;
    terminate?(): void;
}
export declare class Call<T = any> implements ICallHandle {
    clientId: number;
    clientServiceId: number;
    private info;
    private callMeta;
    private callback;
    private send;
    disposed: Subject<Call<T>>;
    private eventHandlers;
    private endEmitted;
    private responseBuilder;
    private requestBuilder;
    constructor(clientId: number, clientServiceId: number, info: IGBCallInfo, callMeta: import('protobufjs').Method, callback: (error?: any, response?: T) => void, send: (message: IGBClientMessage) => void);
    on(eventId: 'error', callback: (arg: Error) => void): void;
    on(eventId: 'data', callback: (arg: T) => void): void;
    on(eventId: 'status', callback: (arg: Status) => void): void;
    on(eventId: 'end', callback: () => void): void;
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
