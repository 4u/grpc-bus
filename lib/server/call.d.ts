import { Subject } from 'rxjs/Subject';
import { Service } from './service';
import { IGBCallInfo, IGBServerMessage } from '../proto';
export declare class Call {
    private service;
    private clientId;
    private clientServiceId;
    private callInfo;
    private send;
    disposed: Subject<Call>;
    private streamHandle;
    private rpcMeta;
    constructor(service: Service, clientId: number, clientServiceId: number, callInfo: IGBCallInfo, send: (msg: IGBServerMessage) => void);
    initCall(): void;
    write(msg: any): void;
    sendEnd(): void;
    dispose(): void;
    private handleCallCallback;
    private setCallHandlers;
    private callEventHandler;
}
