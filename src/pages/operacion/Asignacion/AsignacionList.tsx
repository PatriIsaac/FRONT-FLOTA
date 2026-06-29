import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Truck } from 'lucide-react';
import { asignacionService } from '../../../services/asignacion.service';
import type { Asignacion } from '../../../types/asignacion';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { alerts } from '../../../utils/alerts';
import AsignacionForm from './AsignacionForm';

export default function AsignacionList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAsignacion, setEditingAsignacion] = useState<Asignacion | null>(null);
  const queryClient = useQueryClient();

  const { data: asignaciones = [], isLoading } = useQuery({
    queryKey: ['asignaciones'],
    queryFn: asignacionService.getAll,
    retry: false
  });

  const deleteMutation = useMutation({
    mutationFn: asignacionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      alerts.success('Asignación eliminada');
    },
    onError: (error: any) => {
      alerts.error(error.response?.data?.message || 'Error al eliminar');
    }
  });

  const handleDelete = async (a: Asignacion) => {
    if (await alerts.delete(`la asignación del vehículo ${a.vehiculo?.placa || a.vehiculoId}`)) {
      deleteMutation.mutate(a.asignacionId);
    }
  };

  const handleEdit = (a: Asignacion) => {
    setEditingAsignacion(a);
    setIsFormOpen(true);
  };

  const columns = [
    { 
      key: 'vehiculo', 
      header: 'Vehículo',
      render: (a: Asignacion) => a.vehiculo ? `${a.vehiculo.placa} (${a.vehiculo.codigoPatrimonio})` : `ID: ${a.vehiculoId}`
    },
    { 
      key: 'area', 
      header: 'Área',
      render: (a: Asignacion) => a.area?.nombre || `ID: ${a.areaId}`
    },
    { 
      key: 'conductor', 
      header: 'Conductor',
      render: (a: Asignacion) => a.conductor ? `${a.conductor.nombres} ${a.conductor.apellidos}` : `ID: ${a.conductorId}`
    },
    { 
      key: 'fechas', 
      header: 'Periodo',
      render: (a: Asignacion) => (
        <div className="text-sm">
          <div><span className="font-medium">Inicio:</span> {new Date(a.fechaInicio).toLocaleDateString()}</div>
          <div><span className="font-medium">Fin:</span> {a.fechaFin ? new Date(a.fechaFin).toLocaleDateString() : <Badge variant="success">Vigente</Badge>}</div>
        </div>
      )
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (a: Asignacion) => (
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
          <h1 className="text-2xl font-bold text-gray-900">Asignar Vehículo a Área</h1>
          <p className="text-sm text-gray-500">Asignación de unidades disponibles a las áreas solicitantes.</p>
        </div>
        <Button onClick={() => { setEditingAsignacion(null); setIsFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nueva Asignación
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {!isLoading && asignaciones.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
                <Truck className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No hay asignaciones registradas</h3>
              <p className="mt-1 text-sm text-gray-500 mb-6">
                Comienza asignando vehículos a las áreas y conductores respectivos.
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Crear Asignación
              </Button>
            </div>
          ) : (
            <DataTable 
              columns={columns}
              data={asignaciones}
              isLoading={isLoading}
              emptyMessage="No se encontraron asignaciones."
            />
          )}
        </CardContent>
      </Card>

      <AsignacionForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        asignacion={editingAsignacion}
      />
    </div>
  );
}
