import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, BarChart2, Activity } from 'lucide-react';
import { movimientoService } from '../../../services/movimiento.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function TotalizarKmHoras() {
  const [mesAnio, setMesAnio] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [isCalculated, setIsCalculated] = useState(false);

  const { data: movimientos = [], isLoading } = useQuery({
    queryKey: ['movimientos'],
    queryFn: movimientoService.getAll
  });

  const handleCalcular = () => {
    setIsCalculated(true);
  };

  const dataCalculada = useMemo(() => {
    if (!isCalculated || !movimientos.length) return [];
    
    const [year, month] = mesAnio.split('-');
    
    // Filtramos los movimientos del mes seleccionado
    const movimientosDelMes = movimientos.filter(m => {
      const fecha = new Date(m.fecha);
      return fecha.getFullYear() === parseInt(year) && (fecha.getMonth() + 1) === parseInt(month);
    });

    // Agrupamos por vehículo
    const agrupado: Record<number, any> = {};
    
    movimientosDelMes.forEach(m => {
      const kmRecorridos = (m.kmLlegada || 0) - (m.kmSalida || 0);
      
      if (!agrupado[m.vehiculoId]) {
        agrupado[m.vehiculoId] = {
          vehiculo: m.Vehiculo,
          vehiculoId: m.vehiculoId,
          totalKm: 0,
          totalHoras: 0,
          cantidadViajes: 0
        };
      }
      
      agrupado[m.vehiculoId].totalKm += (kmRecorridos > 0 ? kmRecorridos : 0);
      agrupado[m.vehiculoId].totalHoras += (m.horas || 0);
      agrupado[m.vehiculoId].cantidadViajes += 1;
    });

    return Object.values(agrupado);
  }, [isCalculated, mesAnio, movimientos]);

  const columns = [
    { 
      key: 'vehiculo', 
      header: 'Vehículo',
      render: (d: any) => d.vehiculo ? `${d.vehiculo.placa} (${d.vehiculo.codigoPatrimonio})` : `ID: ${d.vehiculoId}`
    },
    { key: 'cantidadViajes', header: 'Cant. Viajes' },
    { 
      key: 'totalKm', 
      header: 'Total Kilómetros (km)',
      render: (d: any) => (
        <span className="font-semibold text-gray-900">{d.totalKm.toLocaleString()} km</span>
      )
    },
    { 
      key: 'totalHoras', 
      header: 'Total Horas (hr)',
      render: (d: any) => (
        <span className="font-semibold text-gray-900">{d.totalHoras.toLocaleString()} hr</span>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Totalizar km y horas mensuales</h1>
          <p className="text-sm text-gray-500">Consolidación mensual de kilometraje y horas de uso para el cálculo de costos.</p>
        </div>
        <div className="bg-indigo-100 p-2 rounded-full">
          <Activity className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-end gap-4 max-w-md">
            <div className="flex-1">
              <Input
                label="Periodo de Consolidación"
                type="month"
                value={mesAnio}
                onChange={(e) => {
                  setMesAnio(e.target.value);
                  setIsCalculated(false);
                }}
              />
            </div>
            <Button onClick={handleCalcular} className="mb-[2px]">
              <BarChart2 className="w-4 h-4 mr-2" /> Totalizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {isCalculated && (
        <Card>
          <CardContent>
            <DataTable
              enableColumnFilters={true} 
              columns={columns}
              data={dataCalculada}
              isLoading={isLoading}
              emptyMessage={`No se encontraron movimientos registrados para ${mesAnio}.`}
            />
          </CardContent>
        </Card>
      )}
      
      {!isCalculated && (
        <div className="p-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>Selecciona un periodo y presiona "Totalizar" para visualizar el consolidado.</p>
        </div>
      )}
    </div>
  );
}
