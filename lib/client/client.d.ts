import { IGBServerMessage, IGBClientMessage } from '../proto';
import * as ProtoBuf from 'protobufjs';
export declare class Client {
    private protoRoot;
    private send;
    private serviceIdCounter;
    private services;
    constructor(protoRoot: ProtoBuf.Root, send: (message: IGBClientMessage) => void);
    handleMessage(message: IGBServerMessage): void;
    get root(): ProtoBuf.Root;
    reset(): void;
    private recurseBuildTree;
    private buildService;
    private handleServiceCreate;
    private handleCallCreate;
    private handleServiceRelease;
    private handleCallEnded;
    private handleCallEvent;
}
