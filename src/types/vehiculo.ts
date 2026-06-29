export interface Vehiculo {
  vehiculoId: number;
  codigoPatrimonio: string;
  placa: string;
  categoriaVehiculoId: number;
  valorNuevo: number;
  valorResidual: number;
  vidaUtilAnios: number;
  estado: string;
}

export type CreateVehiculoDTO = Omit<Vehiculo, 'vehiculoId'>;
export type UpdateVehiculoDTO = Partial<CreateVehiculoDTO>;
