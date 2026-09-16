export interface IJwtPayload {
  sub: number;
  email: string;
  rut: string;
  nombre: string;
  apellido: string;
  role: string;
}

export interface IAuthUser {
  id: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  role: string;
}

export interface ILoginResponse {
  token: string;
  user: IAuthUser;
}

