import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calculator, BatteryWarning } from 'lucide-react';
import { vehiculoService } from '../../../services/vehiculo.service';
import type { Vehiculo } from '../../../types/vehiculo';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';

export default function DepreciacionOperacional() {
  const { data: vehiculos = [], isLoading } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  // Cálculo de la depreciación lineal operacional (Ec. 2)
  // Depreciación = (Valor Nuevo - Valor Residual) / Vida Útil en meses
  const dataCalculada = useMemo(() => {
    return vehiculos.map((v: Vehiculo) => {
      const valorNuevo = parseFloat(v.valorNuevo as any) || 0;
      const valorResidual = parseFloat(v.valorResidual as any) || 0;
      const vidaUtilAnios = v.vidaUtilAnios || 5;
      
      const depreciacionAnual = (valorNuevo - valorResidual) / vidaUtilAnios;
      const depreciacionMensual = depreciacionAnual / 12;
      
      return {
        id: v.vehiculoId,
        vehiculo: v,
        valorNuevo,
        valorResidual,
        vidaUtilAnios,
        depreciacionAnual,
        depreciacionMensual
      };
    });
  }, [vehiculos]);

  const columns = [
    { 
      key: 'vehiculo', 
      header: 'Vehículo',
      render: (d: any) => `${d.vehiculo.placa} (${d.vehiculo.codigoPatrimonio})`
    },
    { 
      key: 'valorNuevo', 
      header: 'Valor Nuevo (S/.)',
      render: (d: any) => `S/. ${d.valorNuevo.toLocaleString()}`
    },
    { 
      key: 'valorResidual', 
      header: 'Valor Residual (S/.)',
      render: (d: any) => `S/. ${d.valorResidual.toLocaleString()}`
    },
    { 
      key: 'vidaUtil', 
      header: 'Vida Útil (Años)',
      render: (d: any) => `${d.vidaUtilAnios} años`
    },
    { 
      key: 'depreciacionMensual', 
      header: 'Depreciación Mensual (S/.)',
      render: (d: any) => <span className="font-bold text-red-600">S/. {d.depreciacionMensual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Depreciación Lineal Operacional</h1>
          <p className="text-sm text-gray-500">Cálculo de la depreciación mensual operacional del vehículo — Ec. 2.</p>
        </div>
        <div className="bg-red-100 p-2 rounded-full">
          <BatteryWarning className="h-6 w-6 text-red-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Flota Evaluada</p>
              <h3 className="text-2xl font-bold text-gray-900">{vehiculos.length}</h3>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg"><Calculator className="h-6 w-6 text-gray-600" /></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <DataTable 
            columns={columns}
            data={dataCalculada}
            isLoading={isLoading}
            emptyMessage="No hay vehículos registrados para calcular."
          />
        </CardContent>
      </Card>
    </div>
  );
}
