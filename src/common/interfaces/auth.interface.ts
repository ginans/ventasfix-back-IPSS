export interface IJwtPayload {
  sub: number;
  email: string;
  rut: string;
  nombre: string;
  apellido: string;
}

export interface IAuthUser {
  id: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
}

export interface ILoginResponse {
  token: string;
  user: IAuthUser;
}

