export interface MovimientoDiario {
  movimientoId: number;
  vehiculoId: number;
  conductorId: number;
  fecha: string;
  kmSalida: number;
  kmLlegada: number;
  horas: number;
  destino: string;
  vehiculo?: any;
  conductor?: any;
}

export type CreateMovimientoDiarioDTO = Omit<MovimientoDiario, 'movimientoId' | 'vehiculo' | 'conductor'>;
export type UpdateMovimientoDiarioDTO = Partial<CreateMovimientoDiarioDTO>;
