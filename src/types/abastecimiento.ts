export interface Abastecimiento {
  abastecimientoId: number;
  numeroOrden: string;
  vehiculoId: number;
  fecha: string;
  tipoCombustible: string;
  galones: number;
  costo: number;
  kmVelocimetro: number;
  vehiculo?: any;
}

export type CreateAbastecimientoDTO = Omit<Abastecimiento, 'abastecimientoId' | 'vehiculo'>;
export type UpdateAbastecimientoDTO = Partial<CreateAbastecimientoDTO>;
