import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, DollarSign, PieChart } from 'lucide-react';
import { abastecimientoService } from '../../../services/abastecimiento.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function TotalizarConsumo() {
  const [mesAnio, setMesAnio] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [isCalculated, setIsCalculated] = useState(false);

  const { data: abastecimientos = [], isLoading } = useQuery({
    queryKey: ['abastecimientos'],
    queryFn: abastecimientoService.getAll
  });

  const handleCalcular = () => {
    setIsCalculated(true);
  };

  const { dataCalculada, totalCostoMes, totalGalonesMes } = useMemo(() => {
    if (!isCalculated || !abastecimientos.length) return { dataCalculada: [], totalCostoMes: 0, totalGalonesMes: 0 };
    
    const [year, month] = mesAnio.split('-');
    
    const abastMes = abastecimientos.filter(a => {
      const fecha = new Date(a.fecha);
      return fecha.getFullYear() === parseInt(year) && (fecha.getMonth() + 1) === parseInt(month);
    });

    const agrupado: Record<number, any> = {};
    let tCosto = 0;
    let tGalones = 0;
    
    abastMes.forEach(a => {
      if (!agrupado[a.vehiculoId]) {
        agrupado[a.vehiculoId] = { vehiculo: a.Vehiculo, vehiculoId: a.vehiculoId, totalGalones: 0, totalCosto: 0, cantidadVeces: 0 };
      }
      const gal = a.galones || 0;
      const costo = a.costo || 0;
      
      agrupado[a.vehiculoId].totalGalones += gal;
      agrupado[a.vehiculoId].totalCosto += costo;
      agrupado[a.vehiculoId].cantidadVeces += 1;
      
      tGalones += gal;
      tCosto += costo;
    });

    return { 
      dataCalculada: Object.values(agrupado),
      totalCostoMes: tCosto,
      totalGalonesMes: tGalones
    };
  }, [isCalculated, mesAnio, abastecimientos]);

  const columns = [
    { 
      key: 'vehiculo', 
      header: 'Vehículo',
      render: (d: any) => d.vehiculo ? `${d.vehiculo.placa} (${d.vehiculo.codigoPatrimonio})` : `ID: ${d.vehiculoId}`
    },
    { key: 'cantidadVeces', header: 'Frecuencia de Abastecimiento' },
    { 
      key: 'totalGalones', 
      header: 'Total Galones',
      render: (d: any) => <span className="font-medium text-blue-600">{d.totalGalones.toFixed(2)} gal.</span>
    },
    { 
      key: 'totalCosto', 
      header: 'Costo Total (S/.)',
      render: (d: any) => <span className="font-bold text-gray-900">S/. {d.totalCosto.toFixed(2)}</span>
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Totalizar Consumo Mensual</h1>
          <p className="text-sm text-gray-500">Consolidación mensual de galones consumidos y costo de combustible.</p>
        </div>
        <div className="bg-orange-100 p-2 rounded-full">
          <PieChart className="h-6 w-6 text-orange-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <Input
                label="Periodo de Consolidación"
                type="month"
                value={mesAnio}
                onChange={(e) => {
                  setMesAnio(e.target.value);
                  setIsCalculated(false);
                }}
              />
              <Button onClick={handleCalcular} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                <DollarSign className="w-4 h-4 mr-2" /> Totalizar Costos
              </Button>
            </div>
            
            {isCalculated && (
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Gasto Total del Mes</p>
                  <h2 className="text-3xl font-bold text-gray-900">S/. {totalCostoMes.toLocaleString(undefined, {minimumFractionDigits: 2})}</h2>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total de Combustible</p>
                  <h3 className="text-xl font-semibold text-blue-600">{totalGalonesMes.toLocaleString(undefined, {minimumFractionDigits: 2})} galones</h3>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          {isCalculated ? (
            <Card>
              <CardContent className="p-0">
                <DataTable 
                  columns={columns}
                  data={dataCalculada}
                  isLoading={isLoading}
                  emptyMessage={`No se encontraron consumos para ${mesAnio}.`}
                />
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="p-12 text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>Selecciona un periodo y presiona "Totalizar Costos" para visualizar el consolidado.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
