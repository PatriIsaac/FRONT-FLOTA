import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { mantenimientoService } from '../../services/mantenimiento.service';
import type { OrdenServicio } from '../../types/mantenimiento';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { alerts } from '../../utils/alerts';
import OrdenForm from './OrdenForm';

export default function OrdenesList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrden, setEditingOrden] = useState<OrdenServicio | null>(null);
  const queryClient = useQueryClient();

  const { data: ordenes = [], isLoading } = useQuery({
    queryKey: ['mantenimientos'],
    queryFn: mantenimientoService.getAll
  });

  const deleteMutation = useMutation({
    mutationFn: mantenimientoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mantenimientos'] });
      alerts.success('Orden eliminada correctamente');
    }
  });

  const handleDelete = async (o: OrdenServicio) => {
    if (await alerts.delete(`la orden ${o.numero}`)) {
      deleteMutation.mutate(o.ordenId);
    }
  };

  const handleEdit = (o: OrdenServicio) => {
    setEditingOrden(o);
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'ordenId', header: 'ID' },
    { key: 'numero', header: 'Número' },
    { key: 'vehiculoId', header: 'ID Vehículo', render: (o: OrdenServicio) => o.vehiculo?.placa || `ID: ${o.vehiculoId}` },
    { key: 'taller', header: 'Taller' },
    { key: 'fechaEntrada', header: 'Ingreso', render: (o: OrdenServicio) => new Date(o.fechaEntrada).toLocaleDateString() },
    { key: 'kilometraje', header: 'Km' },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (o: OrdenServicio) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(o)}>
            <Edit2 className="h-4 w-4 text-indigo-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(o)}>
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
          <h1 className="text-2xl font-bold text-gray-900">Órdenes de Servicio</h1>
          <p className="text-sm text-gray-500">Gestión de mantenimientos de la flota</p>
        </div>
        <Button onClick={() => { setEditingOrden(null); setIsFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nueva Orden
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable 
            columns={columns}
            data={ordenes}
            isLoading={isLoading}
            emptyMessage="No se encontraron órdenes."
          />
        </CardContent>
      </Card>

      <OrdenForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        orden={editingOrden}
      />
    </div>
  );
}
