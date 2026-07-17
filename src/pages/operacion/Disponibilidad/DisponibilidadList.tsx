import { useQuery } from '@tanstack/react-query';
import { Truck, CheckCircle, Wrench, Clock } from 'lucide-react';
import { vehiculoService } from '../../../services/vehiculo.service';
import type { Vehiculo, EstadoVehiculo } from '../../../types/vehiculo';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';

export default function DisponibilidadList() {
  const { data: vehiculos = [], isLoading } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const getStatusBadge = (estado: EstadoVehiculo) => {
    switch (estado) {
      case 'Operativo':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Operativo</Badge>;
      case 'Mantenimiento':
        return <Badge variant="danger" className="flex items-center gap-1"><Wrench className="h-3 w-3" /> En Mantenimiento</Badge>;
      case 'Inactivo':
        return <Badge variant="default" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Inactivo</Badge>;
      case 'DeBaja':
        return <Badge variant="default" className="flex items-center gap-1"><Clock className="h-3 w-3" /> De Baja</Badge>;
      default:
        return <Badge variant="default">{estado}</Badge>;
    }
  };

  const columns = [
    { key: 'placa', header: 'Placa' },
    { key: 'codigoPatrimonio', header: 'Código Patrimonial' },
    { key: 'categoria', header: 'Categoría', render: (v: Vehiculo) => v.CategoriaVehiculo?.nombre ?? '—' },
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
              <p className="text-sm font-medium text-gray-500">Operativos</p>
              <h3 className="text-2xl font-bold text-green-600">
                {vehiculos.filter(v => v.estado === 'Operativo').length}
              </h3>
            </div>
            <div className="bg-green-100 p-2 rounded-lg"><CheckCircle className="h-6 w-6 text-green-600" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">En Mantenimiento</p>
              <h3 className="text-2xl font-bold text-red-600">
                {vehiculos.filter(v => v.estado === 'Mantenimiento').length}
              </h3>
            </div>
            <div className="bg-red-100 p-2 rounded-lg"><Wrench className="h-6 w-6 text-red-600" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Inactivos / De Baja</p>
              <h3 className="text-2xl font-bold text-slate-600">
                {vehiculos.filter(v => v.estado === 'Inactivo' || v.estado === 'DeBaja').length}
              </h3>
            </div>
            <div className="bg-slate-100 p-2 rounded-lg"><Clock className="h-6 w-6 text-slate-600" /></div>
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
