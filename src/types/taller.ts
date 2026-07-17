export interface Taller {
  tallerId: number;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  estado: boolean;
}

export type CreateTallerDTO = Omit<Taller, 'tallerId' | 'estado'>;
export type UpdateTallerDTO = Partial<CreateTallerDTO> & { estado?: boolean };
