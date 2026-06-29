import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calculator, Calendar, BarChart2 } from 'lucide-react';
import { vehiculoService } from '../../../services/vehiculo.service';
import type { Vehiculo } from '../../../types/vehiculo';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function CalcularIUV() {
  const [mesAnio, setMesAnio] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [isCalculated, setIsCalculated] = useState(false);

  const { data: vehiculos = [], isLoading } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const handleCalcular = () => {
    setIsCalculated(true);
  };

  // Simulate calculation based on month
  const dataCalculada = useMemo(() => {
    if (!isCalculated) return [];
    
    const [year, month] = mesAnio.split('-');
    const diasMes = new Date(parseInt(year), parseInt(month), 0).getDate();
    
    return vehiculos.map(v => {
      // Fake logic: Some vehicles have 100%, others random
      const diasOperados = Math.floor(Math.random() * diasMes) + 1;
      const iuv = (diasOperados / diasMes) * 100;
      
      return {
        id: v.vehiculoId,
        vehiculo: v,
        diasMes,
        diasOperados,
        iuv: parseFloat(iuv.toFixed(2))
      };
    });
  }, [isCalculated, mesAnio, vehiculos]);

  const columns = [
    { 
      key: 'vehiculo', 
      header: 'Vehículo',
      render: (d: any) => `${d.vehiculo.placa} (${d.vehiculo.codigoPatrimonio})`
    },
    { key: 'diasMes', header: 'Días del Mes' },
    { key: 'diasOperados', header: 'Días Operados' },
    { 
      key: 'iuv', 
      header: 'IUV (%)',
      render: (d: any) => (
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5 max-w-[100px]">
            <div 
              className={`h-2.5 rounded-full ${d.iuv > 80 ? 'bg-green-600' : d.iuv > 50 ? 'bg-yellow-400' : 'bg-red-600'}`} 
              style={{ width: `${d.iuv}%` }}
            ></div>
          </div>
          <span className="font-medium text-gray-700">{d.iuv}%</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calcular IUV</h1>
          <p className="text-sm text-gray-500">Cálculo del Índice de Utilización del Vehículo (Ec. 10) mensual.</p>
        </div>
        <div className="bg-blue-100 p-2 rounded-full">
          <Calculator className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-end gap-4 max-w-md">
            <div className="flex-1">
              <Input
                label="Periodo de Evaluación"
                type="month"
                value={mesAnio}
                onChange={(e) => {
                  setMesAnio(e.target.value);
                  setIsCalculated(false);
                }}
              />
            </div>
            <Button onClick={handleCalcular} className="mb-[2px]">
              <BarChart2 className="w-4 h-4 mr-2" /> Calcular IUV
            </Button>
          </div>
        </CardContent>
      </Card>

      {isCalculated && (
        <Card>
          <CardContent className="p-0">
            <DataTable 
              columns={columns}
              data={dataCalculada}
              isLoading={isLoading}
              emptyMessage="No se encontraron datos para calcular."
            />
          </CardContent>
        </Card>
      )}
      
      {!isCalculated && (
        <div className="p-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>Selecciona un periodo y presiona "Calcular IUV" para visualizar los resultados.</p>
        </div>
      )}
    </div>
  );
}
