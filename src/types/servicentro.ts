export interface Servicentro {
  servicentroId: number;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  estado: boolean;
}

export type CreateServicentroDTO = Omit<Servicentro, 'servicentroId' | 'estado'>;
export type UpdateServicentroDTO = Partial<CreateServicentroDTO> & { estado?: boolean };
