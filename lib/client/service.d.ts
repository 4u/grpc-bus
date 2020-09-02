import { IGBClientMessage, IGBServiceInfo, IGBCreateCallResult, IGBCallEnded, IGBCallEvent, IGBCreateServiceResult, IGBReleaseServiceResult } from '../proto';
import { Subject } from 'rxjs/Subject';
import { ICallHandle } from './call';
import * as ProtoBuf from 'protobufjs';
export interface IServicePromise {
    resolve: (handle: IServiceHandle) => void;
    reject: (error?: any) => void;
}
export interface IServiceHandle {
    end(): ICallHandle;
    [id: string]: (argument?: any, callback?: (error?: any, response?: any) => void) => ICallHandle;
}
export declare class Service {
    private serviceMeta;
    private clientId;
    private info;
    private promise;
    private send;
    disposed: Subject<Service>;
    handle: IServiceHandle;
    private calls;
    private callIdCounter;
    private serverReleased;
    constructor(serviceMeta: ProtoBuf.Service, clientId: number, info: IGBServiceInfo, promise: IServicePromise, send: (message: IGBClientMessage) => void);
    initStub(): void;
    handleCreateResponse(msg: IGBCreateServiceResult): void;
    handleCallCreateResponse(msg: IGBCreateCallResult): void;
    handleCallEnded(msg: IGBCallEnded): void;
    handleCallEvent(msg: IGBCallEvent): void;
    handleServiceRelease(msg: IGBReleaseServiceResult): void;
    end(): this;
    dispose(): void;
    private buildStubMethod;
    private startCall;
}
