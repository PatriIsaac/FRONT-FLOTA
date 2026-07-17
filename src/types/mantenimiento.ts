import type { Vehiculo } from './vehiculo';
import type { TipoMantenimiento } from './tipoMantenimiento';
import type { Taller } from './taller';

export interface OrdenServicio {
  ordenId: number;
  numero: string;
  vehiculoId: number;
  tipoId: number;
  tallerId: number;
  fechaEntrada: string;
  fechaSalida?: string | null;
  kilometraje: number;
  Vehiculo?: Vehiculo;
  TipoMantenimiento?: TipoMantenimiento;
  Taller?: Taller;
}

export type CreateOrdenServicioDTO = Omit<OrdenServicio, 'ordenId' | 'Vehiculo' | 'TipoMantenimiento' | 'Taller'>;
export type UpdateOrdenServicioDTO = Partial<CreateOrdenServicioDTO>;
