import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Printer, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { vehiculoService } from '../../../services/vehiculo.service';
import { costosService } from '../../../services/costos.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export default function ReporteGestion() {
  const { data: vehiculos = [] } = useQuery({ queryKey: ['vehiculos'], queryFn: vehiculoService.getAll });
  const { data: costosFijos = [] } = useQuery({ queryKey: ['costosFijos'], queryFn: costosService.getAllFijos });
  const { data: costosOp = [] } = useQuery({ queryKey: ['costosOperacion'], queryFn: costosService.getAllOperacion });

  const handlePrint = () => {
    window.print();
  };

  // Resumen simulado
  const totalFijo = costosFijos.reduce((sum: number, item: any) => sum + parseFloat(item.cfp) + parseFloat(item.cfv), 0);
  const totalVar = costosOp.reduce((sum: number, item: any) => sum + parseFloat(item.cvv), 0);
  const totalCosto = totalFijo + totalVar;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center hide-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes de Gestión</h1>
          <p className="text-sm text-gray-500">Control Mensual del Costo Operacional (MA 122 03 01).</p>
        </div>
        <Button onClick={handlePrint} className="bg-emerald-600 hover:bg-emerald-700">
          <Printer className="w-4 h-4 mr-2" /> Imprimir Reporte
        </Button>
      </div>

      <div className="print-area">
        <div className="bg-white p-8 border border-gray-200 shadow-sm print:border-none print:shadow-none min-h-[1122px] w-full max-w-[800px] mx-auto">
          
          <div className="border-b-2 border-emerald-600 pb-4 mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 uppercase">Control Mensual del Costo Operacional</h2>
              <p className="text-gray-500 text-sm mt-1">Formato: MA 122 03 01</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">Periodo Actual</p>
              <p className="text-gray-500">{new Date().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-50 border-none shadow-none">
              <CardContent className="p-4 flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4"><TrendingUp className="h-6 w-6 text-blue-600" /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Total Flota</p>
                  <p className="text-2xl font-bold text-gray-900">{vehiculos.length} Und.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-none shadow-none">
              <CardContent className="p-4 flex items-center">
                <div className="bg-emerald-100 p-3 rounded-full mr-4"><DollarSign className="h-6 w-6 text-emerald-600" /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Costos Fijos</p>
                  <p className="text-xl font-bold text-gray-900">S/. {totalFijo.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-none shadow-none">
              <CardContent className="p-4 flex items-center">
                <div className="bg-red-100 p-3 rounded-full mr-4"><Activity className="h-6 w-6 text-red-600" /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Costos Variables</p>
                  <p className="text-xl font-bold text-gray-900">S/. {totalVar.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Resumen Operacional General</h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500 uppercase font-bold text-sm mb-2">Costo Total de Operación</p>
              <p className="text-4xl font-black text-emerald-700">S/. {totalCosto.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Top 5 Vehículos de Mayor Costo (Simulación)</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-xs text-gray-600 font-bold uppercase border">Vehículo</th>
                  <th className="p-2 text-xs text-gray-600 font-bold uppercase border">Costo Variable</th>
                  <th className="p-2 text-xs text-gray-600 font-bold uppercase border">Costo Fijo</th>
                  <th className="p-2 text-xs text-gray-600 font-bold uppercase border">Total S/.</th>
                </tr>
              </thead>
              <tbody>
                {vehiculos.slice(0, 5).map((v: any, i: number) => (
                  <tr key={i} className="border-b">
                    <td className="p-2 border">{v.placa}</td>
                    <td className="p-2 border">S/. 1,250.00</td>
                    <td className="p-2 border">S/. 400.00</td>
                    <td className="p-2 border font-bold">S/. 1,650.00</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-24 pt-12 border-t border-gray-300 grid grid-cols-2 gap-12 text-center">
            <div>
              <div className="border-b border-gray-800 w-48 mx-auto mb-2"></div>
              <span className="text-xs font-bold uppercase text-gray-600">Jefatura de Operaciones</span>
            </div>
            <div>
              <div className="border-b border-gray-800 w-48 mx-auto mb-2"></div>
              <span className="text-xs font-bold uppercase text-gray-600">Gerencia General</span>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .hide-print { display: none !important; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
        }
      `}</style>
    </div>
  );
}
