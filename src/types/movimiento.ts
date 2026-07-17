import type { Vehiculo } from './vehiculo';
import type { Conductor } from './conductor';

export interface MovimientoDiario {
  movimientoId: number;
  vehiculoId: number;
  conductorId: number;
  fecha: string;
  kmSalida: number;
  kmLlegada: number;
  horas: number;
  destino: string;
  Vehiculo?: Vehiculo;
  Conductor?: Conductor;
}

export type CreateMovimientoDiarioDTO = Omit<MovimientoDiario, 'movimientoId' | 'Vehiculo' | 'Conductor'>;
export type UpdateMovimientoDiarioDTO = Partial<CreateMovimientoDiarioDTO>;
