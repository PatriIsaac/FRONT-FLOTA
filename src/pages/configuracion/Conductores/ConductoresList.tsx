import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { conductorService } from '../../../services/conductor.service';
import type { Conductor } from '../../../types/conductor';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import { alerts } from '../../../utils/alerts';
import ConductorForm from './ConductorForm';

export default function ConductoresList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConductor, setEditingConductor] = useState<Conductor | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const queryClient = useQueryClient();

  const { data: conductores = [], isLoading: isLoadingConductores } = useQuery({
    queryKey: ['conductores'],
    queryFn: conductorService.getAll
  });

  const conductoresFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return conductores;
    return conductores.filter(c =>
      c.nombre.toLowerCase().includes(q) || c.documento.toLowerCase().includes(q)
    );
  }, [conductores, busqueda]);

  const deleteMutation = useMutation({
    mutationFn: conductorService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conductores'] });
      alerts.success('Conductor eliminado correctamente');
    },
    onError: () => {
      alerts.error('Error al eliminar el conductor');
    }
  });

  const handleDelete = async (conductor: Conductor) => {
    if (await alerts.delete(`al conductor ${conductor.nombre}`)) {
      deleteMutation.mutate(conductor.conductorId);
    }
  };

  const handleEdit = (conductor: Conductor) => {
    setEditingConductor(conductor);
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'conductorId', header: 'ID' },
    { key: 'documento', header: 'Documento' },
    { key: 'nombre', header: 'Nombre Completo' },
    {
      key: 'osActivo',
      header: 'Estado',
      render: (c: Conductor) => (
        <Badge variant={c.osActivo ? 'success' : 'danger'}>
          {c.osActivo ? 'ACTIVO' : 'INACTIVO'}
        </Badge>
      )
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (c: Conductor) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(c)}>
            <Edit2 className="h-4 w-4 text-indigo-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(c)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="lph-root fade-in">
      <div className="lph-header">
        <div>
          <h1 className="lph-header__title">Mantenimiento de Conductores</h1>
          <p className="lph-header__sub">Registro de conductores y asignación vigente a vehículos.</p>
        </div>
        <Button onClick={() => { setEditingConductor(null); setIsFormOpen(true); }}>
          <Plus size={15} /> Nuevo Conductor
        </Button>
      </div>

      <div className="max-w-sm">
        <Input
          placeholder="Buscar por nombre o documento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            data={conductoresFiltrados}
            isLoading={isLoadingConductores}
            emptyMessage="No se encontraron conductores registrados."
            pageSize={10}
            enableColumnFilters={true}
          />
        </CardContent>
      </Card>

      <ConductorForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        conductor={editingConductor}
      />
    </div>
  );
}
