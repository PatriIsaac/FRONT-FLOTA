import { useQuery } from '@tanstack/react-query';
import { Truck, CheckCircle, Wrench, Clock } from 'lucide-react';
import { vehiculoService } from '../../../services/vehiculo.service';
import type { Vehiculo } from '../../../types/vehiculo';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';

export default function DisponibilidadList() {
  const { data: vehiculos = [], isLoading } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Disponible':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Disponible</Badge>;
      case 'En Operacion':
        return <Badge variant="info" className="flex items-center gap-1"><Truck className="h-3 w-3" /> En Operación</Badge>;
      case 'En Mantenimiento':
        return <Badge variant="danger" className="flex items-center gap-1"><Wrench className="h-3 w-3" /> En Mantenimiento</Badge>;
      default:
        return <Badge variant="default" className="flex items-center gap-1"><Clock className="h-3 w-3" /> {estado}</Badge>;
    }
  };

  const columns = [
    { key: 'placa', header: 'Placa' },
    { key: 'marca', header: 'Marca' },
    { key: 'modelo', header: 'Modelo' },
    { key: 'anio', header: 'Año' },
    { 
      key: 'estado', 
      header: 'Disponibilidad Actual',
      render: (v: Vehiculo) => getStatusBadge(v.estado)
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultar Disponibilidad</h1>
          <p className="text-sm text-gray-500">Consulta del estado y disponibilidad operativa de cada unidad en tiempo real.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Flota</p>
              <h3 className="text-2xl font-bold text-gray-900">{vehiculos.length}</h3>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg"><Truck className="h-6 w-6 text-gray-600" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Disponibles</p>
              <h3 className="text-2xl font-bold text-green-600">
                {vehiculos.filter(v => v.estado === 'Disponible').length}
              </h3>
            </div>
            <div className="bg-green-100 p-2 rounded-lg"><CheckCircle className="h-6 w-6 text-green-600" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">En Operación</p>
              <h3 className="text-2xl font-bold text-blue-600">
                {vehiculos.filter(v => v.estado === 'En Operacion').length}
              </h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg"><Truck className="h-6 w-6 text-blue-600" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">En Mantenimiento</p>
              <h3 className="text-2xl font-bold text-red-600">
                {vehiculos.filter(v => v.estado === 'En Mantenimiento').length}
              </h3>
            </div>
            <div className="bg-red-100 p-2 rounded-lg"><Wrench className="h-6 w-6 text-red-600" /></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable 
            columns={columns}
            data={vehiculos}
            isLoading={isLoading}
            emptyMessage="No se encontraron vehículos."
          />
        </CardContent>
      </Card>
    </div>
  );
}
