import type { Vehiculo } from './vehiculo';
import type { Area } from './area';
import type { Conductor } from './conductor';

export interface Asignacion {
  asignacionId: number;
  vehiculoId: number;
  areaId: number;
  conductorId: number | null;
  fechaInicio: string;
  fechaFin: string | null;
  Vehiculo?: Vehiculo;
  Area?: Area;
  Conductor?: Conductor;
}
