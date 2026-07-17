export interface CategoriaVehiculo {
  categoriaVehiculoId: number;
  codigo: string;
  nombre: string;
  activo: boolean;
}

export type CreateCategoriaVehiculoDTO = Omit<CategoriaVehiculo, 'categoriaVehiculoId' | 'activo'>;
export type UpdateCategoriaVehiculoDTO = Partial<CreateCategoriaVehiculoDTO>;
