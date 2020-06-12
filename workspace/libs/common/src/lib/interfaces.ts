export interface Finalizable {
    finalize(): void;
}

export interface WithID {
    id: string;
}

export class WithIDClass implements WithID {
    id: string;
}

export type WithIDType = {
    id: string;
};

export interface LoggerServiceInterface {
    log(level: string, ...data: any[]): LoggerServiceInterface;

    error(message: string, ...data: any[]): any;

    warn(message: string, ...data: any[]): any;

    info(message: any, ...data: any[]): any;

    http(message: string, ...data: any[]): any;

    verbose(message: string, ...data: any[]): any;

    debug(message: string, ...data: any[]): any;

    silly(message: string, ...data: any[]): any;
}
