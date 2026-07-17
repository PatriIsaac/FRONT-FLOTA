import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Eye, TrendingUp, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { vehiculoService } from '../../../services/vehiculo.service';
import { costosService } from '../../../services/costos.service';
import { reporteService } from '../../../services/reporte.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';

export default function ReporteGestion() {
  const mesActual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const [mesAnio, setMesAnio] = useState(mesActual);
  const [generando, setGenerando] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: vehiculos = [] } = useQuery({ queryKey: ['vehiculos'], queryFn: vehiculoService.getAll });
  const { data: costosFijos = [] } = useQuery({ queryKey: ['costosFijos'], queryFn: costosService.getAllFijos });
  const { data: costosOp = [] } = useQuery({ queryKey: ['costosOperacion'], queryFn: costosService.getAllOperacion });

  const totalFijo = costosFijos.reduce((sum: number, item: any) => sum + parseFloat(item.cfp || 0) + parseFloat(item.cfv || 0), 0);
  const totalVar = costosOp.reduce((sum: number, item: any) => sum + parseFloat(item.cvv || 0), 0);
  const totalCosto = totalFijo + totalVar;

  // Liberar la URL anterior si existe
  const limpiarPreview = useCallback(() => {
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }, [pdfUrl]);

  const obtenerMensajeError = async (err: any) => {
    if (err.response?.data instanceof Blob) {
      try {
        const texto = await err.response.data.text();
        const json = JSON.parse(texto);
        return json.error || 'Error de servidor.';
      } catch (e) {
        return 'Error de servidor.';
      }
    }
    return err.response?.data?.error || 'Error de conexión.';
  };

  const handleDescargar = async () => {
    setError(null);
    setGenerando(true);
    try {
      await reporteService.descargarCostoOperacional(mesAnio);
      alerts.success(`Reporte ${mesAnio} descargado`);
    } catch (err: any) {
      const mensaje = await obtenerMensajeError(err);
      setError(mensaje);
    } finally {
      setGenerando(false);
    }
  };

  const handlePrevisualizar = async () => {
    setError(null);
    limpiarPreview();
    setPreviewing(true);
    try {
      const url = await reporteService.previsualizarCostoOperacional(mesAnio);
      setPdfUrl(url);
    } catch (err: any) {
      const mensaje = await obtenerMensajeError(err);
      setError(mensaje);
    } finally {
      setPreviewing(false);
    }
  };

  const formatMes = (m: string) => {
    const [anio, mes] = m.split('-');
    const fecha = new Date(parseInt(anio), parseInt(mes) - 1);
    return fecha.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Encabezado */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--text-primary)]">Reportes de Gestión</h1>
          <p className="text-sm text-[color:var(--text-secondary)]">
            Control Mensual del Costo Operacional de Vehículo — MA 122 03 01
          </p>
        </div>
        <div className="bg-red-100 p-2 rounded-full">
          <FileText className="h-6 w-6 text-red-600" />
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full shrink-0">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-[color:var(--text-secondary)] uppercase font-bold">Total Flota</p>
              <p className="text-xl font-bold text-[color:var(--text-primary)]">{vehiculos.length} Und.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-full shrink-0">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-[color:var(--text-secondary)] uppercase font-bold">Costos Fijos</p>
              <p className="text-xl font-bold text-[color:var(--text-primary)]">
                S/. {totalFijo.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-red-100 p-3 rounded-full shrink-0">
              <Activity className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-[color:var(--text-secondary)] uppercase font-bold">Costos Variables</p>
              <p className="text-xl font-bold text-[color:var(--text-primary)]">
                S/. {totalVar.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel de generación BIRT */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-[color:var(--text-primary)] mb-1">
            Generar Reporte PDF (BIRT)
          </h3>
          <p className="text-sm text-[color:var(--text-secondary)] mb-4">
            Seleccione el periodo y genere el formulario oficial MA 122 03 01 como PDF.
            Requiere que el servicio BIRT (ReportesBIRT) esté compilado y que existan datos
            de costos calculados para el mes seleccionado.
          </p>

          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-1">
                Periodo (Mes/Año)
              </label>
              <input
                type="month"
                value={mesAnio}
                onChange={e => {
                  setMesAnio(e.target.value);
                  setError(null);
                  limpiarPreview();
                }}
                className="h-10 px-3 rounded-md border border-[var(--border-color)] bg-[var(--input-bg)] text-[color:var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <Button
              onClick={handleDescargar}
              isLoading={generando}
              disabled={generando || previewing}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>

            <Button
              onClick={handlePrevisualizar}
              isLoading={previewing}
              disabled={generando || previewing}
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              Vista previa
            </Button>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mt-4 flex items-start gap-3 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Periodo seleccionado */}
          <p className="mt-3 text-xs text-[color:var(--text-secondary)]">
            Periodo seleccionado: <span className="font-semibold capitalize">{formatMes(mesAnio)}</span>
            {' · '}Costo total de operación acumulado:
            <span className="font-semibold"> S/. {totalCosto.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </p>
        </CardContent>
      </Card>

      {/* Vista previa del PDF */}
      {pdfUrl && (
        <Card>
          <CardContent className="p-0 overflow-hidden rounded-md">
            <div className="flex items-center justify-between px-4 py-2 bg-[var(--input-bg)] border-b border-[var(--border-color)]">
              <span className="text-sm font-medium text-[color:var(--text-primary)]">
                Vista previa — costo-operacional-{mesAnio}.pdf
              </span>
              <Button variant="ghost" size="sm" onClick={limpiarPreview}>
                Cerrar
              </Button>
            </div>
            <iframe
              src={pdfUrl}
              title="Vista previa del reporte de costo operacional"
              className="w-full border-0"
              style={{ height: '75vh' }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
