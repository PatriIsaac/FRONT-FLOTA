import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { abastecimientoService } from '../../services/abastecimiento.service';
import type { Abastecimiento } from '../../types/abastecimiento';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { alerts } from '../../utils/alerts';
import AbastecimientoForm from './AbastecimientoForm';

export default function AbastecimientoList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAbastecimiento, setEditingAbastecimiento] = useState<Abastecimiento | null>(null);
  const queryClient = useQueryClient();

  const { data: abastecimientos = [], isLoading } = useQuery({
    queryKey: ['abastecimientos'],
    queryFn: abastecimientoService.getAll
  });

  const deleteMutation = useMutation({
    mutationFn: abastecimientoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abastecimientos'] });
      alerts.success('Eliminado correctamente');
    }
  });

  const handleDelete = async (a: Abastecimiento) => {
    if (await alerts.delete(`la orden ${a.numeroOrden}`)) {
      deleteMutation.mutate(a.abastecimientoId);
    }
  };

  const handleEdit = (a: Abastecimiento) => {
    setEditingAbastecimiento(a);
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'abastecimientoId', header: 'ID' },
    { key: 'numeroOrden', header: 'Orden' },
    { key: 'vehiculoId', header: 'ID Vehículo', render: (a: Abastecimiento) => a.vehiculo?.placa || `ID: ${a.vehiculoId}` },
    { key: 'fecha', header: 'Fecha', render: (a: Abastecimiento) => new Date(a.fecha).toLocaleDateString() },
    { key: 'tipoCombustible', header: 'Combustible' },
    { key: 'galones', header: 'Galones' },
    { key: 'costo', header: 'Costo ($)', render: (a: Abastecimiento) => `$${a.costo.toFixed(2)}` },
    { key: 'kmVelocimetro', header: 'Km' },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (a: Abastecimiento) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(a)}>
            <Edit2 className="h-4 w-4 text-indigo-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(a)}>
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
          <h1 className="text-2xl font-bold text-gray-900">Abastecimientos</h1>
          <p className="text-sm text-gray-500">Gestión de consumo de combustible</p>
        </div>
        <Button onClick={() => { setEditingAbastecimiento(null); setIsFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Abastecimiento
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable 
            columns={columns}
            data={abastecimientos}
            isLoading={isLoading}
            emptyMessage="No se encontraron registros."
          />
        </CardContent>
      </Card>

      <AbastecimientoForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        abastecimiento={editingAbastecimiento}
      />
    </div>
  );
}
