import { api } from './api';

/**
 * Descarga el PDF del reporte de Control Mensual de Costo Operacional (MA 122 03 01)
 * generado por el servicio BIRT a través del backend.
 */
export const reporteService = {
  /**
   * Solicita al backend la generación del PDF vía BIRT y lo descarga directamente.
   * @param mesAnio Periodo en formato YYYY-MM (ej. "2024-05")
   */
  descargarCostoOperacional: async (mesAnio: string): Promise<void> => {
    const response = await api.get('/reportes/costo-operacional', {
      params: { mesAnio },
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `costo-operacional-${mesAnio}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Solicita al backend la generación del PDF vía BIRT y devuelve un blob URL
   * para previsualización en un <iframe> o <embed>.
   * @param mesAnio Periodo en formato YYYY-MM (ej. "2024-05")
   * @returns Blob URL del PDF generado
   */
  previsualizarCostoOperacional: async (mesAnio: string): Promise<string> => {
    const response = await api.get('/reportes/costo-operacional', {
      params: { mesAnio },
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    return window.URL.createObjectURL(blob);
  },
};
