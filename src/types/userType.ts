export interface userSaveRequest {
  email: string;
  name: string;
  password: string;
  authId: number;
}

export interface userFindRequest {
  email: string;
  password: string;
}

export interface userUpdatePasswordRequest {
  email: string;
  password: string;
  authId: number;
}

export interface userUpdateNameRequest {
  name: string;
}

export interface userDeleteRequest {
  password: string;
}

export interface userSignInResponse {
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
}
