import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { History, Wrench } from 'lucide-react';
import { vehiculoService } from '../../../services/vehiculo.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

export default function HistorialTecnico() {
  const [selectedVehiculoId, setSelectedVehiculoId] = useState<number>(0);

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const { data: ordenes = [], isLoading } = useQuery({
    queryKey: ['ordenes'],
    queryFn: async () => {
      const { api } = await import('../../../services/api');
      const { data } = await api.get('/mantenimientos/ordenes');
      return data;
    }
  });

  const historial = useMemo(() => {
    if (!selectedVehiculoId) return [];
    return ordenes.filter((o: any) => o.vehiculoId === Number(selectedVehiculoId));
  }, [selectedVehiculoId, ordenes]);

  const columns = [
    { key: 'numero', header: 'N° Orden' },
    { 
      key: 'tipo', 
      header: 'Tipo',
      render: (o: any) => o.tipo?.descripcion || `ID: ${o.tipoId}`
    },
    { key: 'taller', header: 'Taller' },
    { 
      key: 'fechas', 
      header: 'Fechas',
      render: (o: any) => (
        <div className="text-sm">
          <div><span className="font-medium text-gray-500">Entrada:</span> {new Date(o.fechaEntrada).toLocaleDateString()}</div>
          <div><span className="font-medium text-gray-500">Salida:</span> {o.fechaSalida ? new Date(o.fechaSalida).toLocaleDateString() : <Badge variant="warning">En taller</Badge>}</div>
        </div>
      )
    },
    { 
      key: 'kilometraje', 
      header: 'Kilometraje',
      render: (o: any) => `${o.kilometraje.toLocaleString()} km`
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial Técnico</h1>
          <p className="text-sm text-gray-500">Consulta del historial de intervenciones preventivas y correctivas por vehículo.</p>
        </div>
        <div className="bg-emerald-100 p-2 rounded-full">
          <History className="h-6 w-6 text-emerald-600" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="max-w-md">
            <Select 
              label="Seleccionar Vehículo" 
              value={selectedVehiculoId}
              onChange={(e) => setSelectedVehiculoId(Number(e.target.value))}
              options={[
                { value: 0, label: 'Seleccione un vehículo para ver su historial...' },
                ...vehiculos.map((v: any) => ({ value: v.vehiculoId, label: `${v.placa} - ${v.codigoPatrimonio}` }))
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {selectedVehiculoId !== 0 ? (
        <Card>
          <CardContent>
            <DataTable
            enableColumnFilters={true} 
              columns={columns}
              data={historial}
              isLoading={isLoading}
              emptyMessage="Este vehículo no tiene mantenimientos registrados."
            />
          </CardContent>
        </Card>
      ) : (
        <div className="p-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <Wrench className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>Selecciona un vehículo para visualizar todas sus órdenes de servicio y trabajos realizados.</p>
        </div>
      )}
    </div>
  );
}
