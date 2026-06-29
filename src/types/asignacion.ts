import type { Vehiculo } from './vehiculo';
import type { Area } from './area';
import type { Conductor } from './conductor';

export interface Asignacion {
  asignacionId: number;
  vehiculoId: number;
  areaId: number;
  conductorId: number;
  fechaInicio: string;
  fechaFin: string | null;
  vehiculo?: Vehiculo;
  area?: Area;
  conductor?: Conductor;
}
