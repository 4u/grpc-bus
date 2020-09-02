import { Subject } from 'rxjs/Subject';
import { IGBServiceInfo } from '../proto';
import * as ProtoBuf from 'protobufjs';
export declare class Service {
    private protoRoot;
    private grpc;
    disposed: Subject<Service>;
    stub: any;
    serviceMeta: ProtoBuf.Service;
    private info;
    private clientIds;
    constructor(protoRoot: ProtoBuf.Root, clientId: number, info: IGBServiceInfo, grpc: any);
    initStub(): void;
    clientAdd(id: number): void;
    clientRelease(id: number): void;
    private destroy;
}
