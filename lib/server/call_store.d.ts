import { Service } from './service';
import { IGBServerMessage, IGBCreateCall, IGBSendCall, IGBEndCall } from '../proto';
export declare class CallStore {
    private service;
    private clientId;
    private send;
    private calls;
    constructor(service: Service, clientId: number, send: (msg: IGBServerMessage) => void);
    initCall(msg: IGBCreateCall): void;
    handleCallEnd(msg: IGBEndCall): void;
    handleCallWrite(msg: IGBSendCall): void;
    releaseLocalCall(id: number): void;
    dispose(): void;
}
