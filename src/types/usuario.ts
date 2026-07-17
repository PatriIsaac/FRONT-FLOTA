export interface Rol {
  rolId: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface Usuario {
  usuarioId: number;
  nombres: string;
  apellidos: string;
  email: string;
  rolId: number;
  estado: boolean;
  Rol?: Rol;
}
