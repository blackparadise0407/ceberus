export interface JwtPayload {
  sub: string;
  iss?: string;
  iat?: number;
  exp?: number;
  [key: string]: any;
}
