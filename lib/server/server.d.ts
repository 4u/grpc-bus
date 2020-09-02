import { IGBServerMessage, IGBClientMessage } from '../proto';
import * as ProtoBuf from 'protobufjs';
export declare class Server {
    private protoRoot;
    private send;
    private grpc;
    private store;
    private clientIdToService;
    constructor(protoRoot: ProtoBuf.Root, send: (message: IGBServerMessage) => void, grpc: any);
    handleMessage(message: IGBClientMessage): void;
    dispose(): void;
    private releaseLocalService;
    private handleServiceCreate;
    private handleServiceRelease;
    private handleCallSend;
    private handleCallCreate;
    private handleCallEnd;
}
