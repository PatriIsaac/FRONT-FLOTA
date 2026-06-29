import type { Vehiculo } from './vehiculo';

export interface CostoFijoMensual {
  cfmId: number;
  vehiculoId: number;
  mesAnio: string; // Formato YYYY-MM
  cfp: number;
  cfv: number;
  vehiculo?: Vehiculo;
}
