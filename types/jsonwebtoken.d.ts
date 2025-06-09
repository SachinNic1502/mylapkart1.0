declare module 'jsonwebtoken' {
  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string | Buffer,
    options?: SignOptions
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: string | Buffer,
    options?: VerifyOptions
  ): object | string;

  export function decode(
    token: string,
    options?: DecodeOptions
  ): null | { [key: string]: any } | string;

  export interface SignOptions {
    algorithm?: string;
    expiresIn?: string | number;
    notBefore?: string | number;
    audience?: string | string[];
    issuer?: string;
    jwtid?: string;
    subject?: string;
    noTimestamp?: boolean;
    header?: object;
    keyid?: string;
    [propName: string]: any;
  }

  export interface VerifyOptions {
    algorithms?: string[];
    audience?: string | RegExp | Array<string | RegExp>;
    clockTimestamp?: number;
    clockTolerance?: number;
    complete?: boolean;
    issuer?: string | string[];
    ignoreExpiration?: boolean;
    ignoreNotBefore?: boolean;
    jwtid?: string;
    nonce?: string;
    subject?: string;
    maxAge?: string | number;
  }

  export interface DecodeOptions {
    complete?: boolean;
    json?: boolean;
  }

  export class JsonWebTokenError extends Error {
    constructor(message: string);
  }

  export class NotBeforeError extends JsonWebTokenError {
    constructor(message: string);
  }

  export class TokenExpiredError extends JsonWebTokenError {
    expiredAt: Date;
    constructor(message: string, expiredAt: Date);
  }
}
