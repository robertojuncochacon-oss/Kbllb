export type Result<T,E> = {readonly ok:true;readonly value:T}|{readonly ok:false;readonly error:E};
export const ok=<T>(value:T):Result<T,never>=>({ok:true,value});
export const err=<E>(error:E):Result<never,E>=>({ok:false,error});
export interface AppError {readonly code:string;readonly message:string;readonly sourceId?:string;readonly retryable:boolean;}
