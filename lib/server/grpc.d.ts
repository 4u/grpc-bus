import * as ProtoBuf from 'protobufjs';
export interface IGRPCMethodObject {
    path: string;
    requestStream: boolean;
    responseStream: boolean;
    requestType: any;
    responseType: any;
    requestSerialize: (msg: any) => any;
    requestDeserialize: (msg: any) => any;
    responseSerialize: (msg: any) => any;
    responseDeserialize: (msg: any) => any;
}
export interface IGRPCServiceObject {
    [methodName: string]: IGRPCMethodObject;
}
export declare function fullyQualifiedName(meta: any): string;
export declare function getPassthroughServiceAttrs(service: ProtoBuf.Service, options: any): IGRPCServiceObject;
export declare function makePassthroughClientConstructor(grpc: any, service: any, options?: any): any;
