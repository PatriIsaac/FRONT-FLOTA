// import { api } from './api'; // Remove API for now to mock the missing backend

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getLocal = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocal = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const mantenimientoDetalleService = {
  getAll: async () => {
    await delay(300);
    return getLocal('mock_mantenimiento_detalles');
  },
  create: async (payload: any) => {
    await delay(300);
    const data = getLocal('mock_mantenimiento_detalles');
    const newItem = { ...payload, detalleId: Date.now() };
    
    // Attempt to enrich with orden details if possible
    try {
      const { api } = await import('./api');
      const { data: ordenes } = await api.get('/mantenimientos');
      const orden = ordenes.find((o: any) => o.ordenId === payload.ordenId);
      if (orden) {
        newItem.orden = orden;
      }
    } catch (e) {
      // ignore
    }

    data.push(newItem);
    setLocal('mock_mantenimiento_detalles', data);
    return newItem;
  },
  delete: async (id: number) => {
    await delay(300);
    const data = getLocal('mock_mantenimiento_detalles').filter((d: any) => d.detalleId !== id);
    setLocal('mock_mantenimiento_detalles', data);
  }
};

export const mantenimientoMensualService = {
  getAll: async () => {
    await delay(300);
    return getLocal('mock_mantenimiento_mensual');
  },
  create: async (payload: any) => {
    await delay(300);
    const data = getLocal('mock_mantenimiento_mensual');
    const newItem = { ...payload, registroId: Date.now() };
    
    // Attempt to enrich with vehiculo details if possible
    try {
      const { vehiculoService } = await import('./vehiculo.service');
      const vehiculos = await vehiculoService.getAll();
      const vehiculo = vehiculos.find((v: any) => v.vehiculoId === payload.vehiculoId);
      if (vehiculo) {
        newItem.vehiculo = vehiculo;
      }
    } catch (e) {
      // ignore
    }

    data.push(newItem);
    setLocal('mock_mantenimiento_mensual', data);
    return newItem;
  },
  delete: async (id: number) => {
    await delay(300);
    const data = getLocal('mock_mantenimiento_mensual').filter((d: any) => d.registroId !== id);
    setLocal('mock_mantenimiento_mensual', data);
  }
};
