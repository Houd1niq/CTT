export interface AuthState {
  accessToken: string | null;
  recoveryEmail: string | null;
  recoveryToken: string | null
}

export interface LoginDto {
  email: string;
  password: string;
}
