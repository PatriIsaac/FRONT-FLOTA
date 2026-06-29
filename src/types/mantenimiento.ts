export interface OrdenServicio {
  ordenId: number;
  numero: string;
  vehiculoId: number;
  tipoId: number;
  taller: string;
  fechaEntrada: string;
  fechaSalida?: string | null;
  kilometraje: number;
  vehiculo?: any;
  tipo?: any;
}

export type CreateOrdenServicioDTO = Omit<OrdenServicio, 'ordenId' | 'vehiculo' | 'tipo'>;
export type UpdateOrdenServicioDTO = Partial<CreateOrdenServicioDTO>;
