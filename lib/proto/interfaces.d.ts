export interface IGBClientMessage {
    serviceCreate?: IGBCreateService;
    serviceRelease?: IGBReleaseService;
    callCreate?: IGBCreateCall;
    callEnd?: IGBCallEnd;
    callSend?: IGBSendCall;
}
export interface IGBServerMessage {
    serviceCreate?: IGBCreateServiceResult;
    serviceRelease?: IGBReleaseServiceResult;
    callCreate?: IGBCreateCallResult;
    callEvent?: IGBCallEvent;
    callEnded?: IGBCallEnded;
}
export interface IGBMetadata {
    fields?: string;
}
export interface IGBServiceInfo {
    endpoint?: string;
    serviceId?: string;
}
export interface IGBCreateService {
    serviceId?: number;
    serviceInfo?: IGBServiceInfo;
}
export interface IGBReleaseService {
    serviceId?: number;
}
export interface IGBCallInfo {
    methodId?: string;
    binArgument?: Uint8Array;
    binMeta?: IGBMetadata;
}
export interface IGBCreateCall {
    serviceId?: number;
    callId?: number;
    info?: IGBCallInfo;
}
export interface IGBCallEnded {
    callId?: number;
    serviceId?: number;
}
export interface IGBEndCall {
    callId?: number;
    serviceId?: number;
}
export interface IGBSendCall {
    callId?: number;
    serviceId?: number;
    binData?: Uint8Array;
    isEnd?: boolean;
}
export interface IGBCreateServiceResult {
    serviceId?: number;
    result?: ECreateServiceResult;
    errorDetails?: string;
}
export declare const enum ECreateServiceResult {
    SUCCESS = 0,
    INVALID_ID = 1,
    GRPC_ERROR = 2
}
export interface IGBReleaseServiceResult {
    serviceId?: number;
}
export interface IGBCreateCallResult {
    callId?: number;
    serviceId?: number;
    result?: ECreateCallResult;
    errorDetails?: string;
}
export declare const enum ECreateCallResult {
    SUCCESS = 0,
    INVALID_ID = 1,
    GRPC_ERROR = 2
}
export interface IGBCallEvent {
    callId?: number;
    serviceId?: number;
    event?: string;
    jsonData?: string;
    binData?: Uint8Array;
}
export interface IGBCallEnd {
    callId?: number;
    serviceId?: number;
}
