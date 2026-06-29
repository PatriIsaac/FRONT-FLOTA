import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { vehiculoService } from '../../../services/vehiculo.service';
import type { Vehiculo } from '../../../types/vehiculo';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { alerts } from '../../../utils/alerts';
import VehiculoForm from './VehiculoForm';

export default function VehiculosList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
  const queryClient = useQueryClient();

  const { data: vehiculos = [], isLoading } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const deleteMutation = useMutation({
    mutationFn: vehiculoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
      alerts.success('Vehículo eliminado correctamente');
    },
    onError: () => {
      alerts.error('Error al eliminar el vehículo');
    }
  });

  const handleDelete = async (vehiculo: Vehiculo) => {
    if (await alerts.delete(`el vehículo con placa ${vehiculo.placa}`)) {
      deleteMutation.mutate(vehiculo.vehiculoId);
    }
  };

  const handleEdit = (vehiculo: Vehiculo) => {
    setEditingVehiculo(vehiculo);
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'codigoPatrimonio', header: 'Cod. Patrimonial' },
    { key: 'placa', header: 'Placa' },
    { key: 'categoriaVehiculoId', header: 'Cat. ID', render: (v: Vehiculo) => `Cat: ${v.categoriaVehiculoId}` },
    { key: 'valorNuevo', header: 'Valor Nuevo', render: (v: Vehiculo) => `$${v.valorNuevo.toLocaleString()}` },
    { key: 'valorResidual', header: 'Valor Residual', render: (v: Vehiculo) => `$${v.valorResidual.toLocaleString()}` },
    { key: 'vidaUtilAnios', header: 'Vida Útil', render: (v: Vehiculo) => `${v.vidaUtilAnios} años` },
    { 
      key: 'estado', 
      header: 'Estado',
      render: (v: Vehiculo) => {
        const variants = {
          'Activo': 'success',
          'Inactivo': 'danger'
        } as const;
        const variant = variants[v.estado as keyof typeof variants] || 'primary';
        return <Badge variant={variant}>{v.estado.toUpperCase()}</Badge>;
      }
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (v: Vehiculo) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(v)}>
            <Edit2 className="h-4 w-4 text-indigo-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(v)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mantenimiento de Vehículos</h1>
          <p className="text-sm text-gray-500">Gestión y codificación patrimonial de las unidades de la flota.</p>
        </div>
        <Button onClick={() => { setEditingVehiculo(null); setIsFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Vehículo
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable 
            columns={columns}
            data={vehiculos}
            isLoading={isLoading}
            emptyMessage="No se encontraron vehículos registrados."
          />
        </CardContent>
      </Card>

      <VehiculoForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        vehiculo={editingVehiculo}
      />
    </div>
  );
}
