import { IGBServiceInfo } from '../proto';
import { Service } from './service';
import * as ProtoBuf from 'protobufjs';
export declare class ServiceStore {
    private protoRoot;
    private grpc;
    private services;
    constructor(protoRoot: ProtoBuf.Root, grpc: any);
    getService(clientId: number, info: IGBServiceInfo): Service;
}
