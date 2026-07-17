import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Droplet, Activity } from 'lucide-react';
import { abastecimientoService } from '../../../services/abastecimiento.service';
import { movimientoService } from '../../../services/movimiento.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function CalcularRendimiento() {
  const [mesAnio, setMesAnio] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [isCalculated, setIsCalculated] = useState(false);

  const { data: abastecimientos = [], isLoading: loadAbast } = useQuery({
    queryKey: ['abastecimientos'],
    queryFn: abastecimientoService.getAll
  });

  const { data: movimientos = [], isLoading: loadMov } = useQuery({
    queryKey: ['movimientos'],
    queryFn: movimientoService.getAll
  });

  const handleCalcular = () => {
    setIsCalculated(true);
  };

  const dataCalculada = useMemo(() => {
    if (!isCalculated || !abastecimientos.length) return [];
    
    const [year, month] = mesAnio.split('-');
    
    // Filtramos los registros del mes
    const abastMes = abastecimientos.filter(a => {
      const fecha = new Date(a.fecha);
      return fecha.getFullYear() === parseInt(year) && (fecha.getMonth() + 1) === parseInt(month);
    });

    const movMes = movimientos.filter(m => {
      const fecha = new Date(m.fecha);
      return fecha.getFullYear() === parseInt(year) && (fecha.getMonth() + 1) === parseInt(month);
    });

    // Agrupamos por vehículo
    const agrupado: Record<number, any> = {};
    
    // Sumamos galones
    abastMes.forEach(a => {
      if (!agrupado[a.vehiculoId]) {
        agrupado[a.vehiculoId] = { vehiculo: a.Vehiculo, vehiculoId: a.vehiculoId, totalGalones: 0, totalKm: 0 };
      }
      agrupado[a.vehiculoId].totalGalones += (a.galones || 0);
    });

    // Sumamos km de movimientos
    movMes.forEach(m => {
      if (!agrupado[m.vehiculoId]) {
        agrupado[m.vehiculoId] = { vehiculo: m.Vehiculo, vehiculoId: m.vehiculoId, totalGalones: 0, totalKm: 0 };
      }
      const kmRecorridos = (m.kmLlegada || 0) - (m.kmSalida || 0);
      agrupado[m.vehiculoId].totalKm += (kmRecorridos > 0 ? kmRecorridos : 0);
    });

    // Calculamos rendimiento
    const resultados = Object.values(agrupado).map((d: any) => {
      const rendimiento = d.totalGalones > 0 ? (d.totalKm / d.totalGalones) : 0;
      return {
        ...d,
        rendimiento: parseFloat(rendimiento.toFixed(2))
      };
    });

    // Filtramos solo los que tuvieron abastecimiento
    return resultados.filter(d => d.totalGalones > 0);
  }, [isCalculated, mesAnio, abastecimientos, movimientos]);

  const columns = [
    { 
      key: 'vehiculo', 
      header: 'Vehículo',
      render: (d: any) => d.vehiculo ? `${d.vehiculo.placa} (${d.vehiculo.codigoPatrimonio})` : `ID: ${d.vehiculoId}`
    },
    { 
      key: 'totalKm', 
      header: 'Total Km Recorridos',
      render: (d: any) => <span className="font-medium text-gray-700">{d.totalKm.toLocaleString()} km</span>
    },
    { 
      key: 'totalGalones', 
      header: 'Total Galones',
      render: (d: any) => <span className="font-medium text-blue-600">{d.totalGalones.toFixed(2)} gal.</span>
    },
    { 
      key: 'rendimiento', 
      header: 'Rendimiento (km/gal)',
      render: (d: any) => (
        <span className={`font-bold ${d.rendimiento > 15 ? 'text-green-600' : d.rendimiento < 5 ? 'text-red-600' : 'text-gray-900'}`}>
          {d.rendimiento} km/gal
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calcular Rendimiento</h1>
          <p className="text-sm text-gray-500">Cálculo del rendimiento de combustible por unidad (km/galón).</p>
        </div>
        <div className="bg-orange-100 p-2 rounded-full">
          <Activity className="h-6 w-6 text-orange-600" />
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
            <Button onClick={handleCalcular} className="mb-[2px] bg-orange-500 hover:bg-orange-600 text-white">
              <Droplet className="w-4 h-4 mr-2" /> Calcular
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
              isLoading={loadAbast || loadMov}
              emptyMessage={`No se encontraron registros de abastecimiento para ${mesAnio}.`}
            />
          </CardContent>
        </Card>
      )}
      
      {!isCalculated && (
        <div className="p-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>Selecciona un periodo y presiona "Calcular" para visualizar los resultados de rendimiento.</p>
        </div>
      )}
    </div>
  );
}
