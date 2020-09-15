import { IGBServerMessage, IGBClientMessage } from '../proto';
export declare class Client {
    private protoRoot;
    private send;
    private serviceIdCounter;
    private services;
    constructor(protoRoot: import('protobufjs').Root, send: (message: IGBClientMessage) => void);
    handleMessage(message: IGBServerMessage): void;
    get root(): import('protobufjs').Root;
    reset(): void;
    private recurseBuildTree;
    private buildService;
    private handleServiceCreate;
    private handleCallCreate;
    private handleServiceRelease;
    private handleCallEnded;
    private handleCallEvent;
}
