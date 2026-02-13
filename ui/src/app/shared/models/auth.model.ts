export interface Login {
  email: string;
  password: string;
}

export interface Register {
  email: string;
  password: string;
  name: string;
}

export interface TokenResponse {
  access_token: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface JwtPayload {
  id: string;
  email: string;
}
