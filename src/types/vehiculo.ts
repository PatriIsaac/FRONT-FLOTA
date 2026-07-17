import type { CategoriaVehiculo } from './categoriaVehiculo';

export const ESTADOS_VEHICULO = ['Operativo', 'Mantenimiento', 'Inactivo', 'DeBaja'] as const;
export type EstadoVehiculo = typeof ESTADOS_VEHICULO[number];

export interface Vehiculo {
  vehiculoId: number;
  codigoPatrimonio: string;
  placa: string;
  categoriaVehiculoId: number;
  valorNuevo: number;
  valorResidual: number;
  vidaUtilAnios: number;
  estado: EstadoVehiculo;
  CategoriaVehiculo?: CategoriaVehiculo;
}

export type CreateVehiculoDTO = Omit<Vehiculo, 'vehiculoId' | 'CategoriaVehiculo'>;
export type UpdateVehiculoDTO = Partial<CreateVehiculoDTO>;
