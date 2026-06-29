export interface Conductor {
  conductorId: number;
  documento: string;
  nombre: string;
  osActivo: boolean;
}

export type CreateConductorDTO = Omit<Conductor, 'conductorId'>;
export type UpdateConductorDTO = Partial<CreateConductorDTO>;
