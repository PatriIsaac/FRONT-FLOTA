import type { Vehiculo } from './vehiculo';
import type { Servicentro } from './servicentro';

export interface Abastecimiento {
  abastecimientoId: number;
  numeroOrden: string;
  vehiculoId: number;
  servicentroId: number;
  fecha: string;
  tipoCombustible: string;
  galones: number;
  costo: number;
  kmVelocimetro: number;
  Vehiculo?: Vehiculo;
  Servicentro?: Servicentro;
}

export type CreateAbastecimientoDTO = Omit<Abastecimiento, 'abastecimientoId' | 'Vehiculo' | 'Servicentro'>;
export type UpdateAbastecimientoDTO = Partial<CreateAbastecimientoDTO>;
