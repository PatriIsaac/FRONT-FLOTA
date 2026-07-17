import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { movimientoService } from '../../../services/movimiento.service';
import type { MovimientoDiario } from '../../../types/movimiento';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { DataTable } from '../../../components/ui/DataTable';
import { alerts } from '../../../utils/alerts';
import MovimientoForm from './MovimientoForm';

export default function MovimientoList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovimiento, setEditingMovimiento] = useState<MovimientoDiario | null>(null);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const queryClient = useQueryClient();

  const { data: movimientos = [], isLoading } = useQuery({
    queryKey: ['movimientos'],
    queryFn: movimientoService.getAll
  });

  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter(m => {
      const fecha = m.fecha.slice(0, 10);
      if (desde && fecha < desde) return false;
      if (hasta && fecha > hasta) return false;
      return true;
    });
  }, [movimientos, desde, hasta]);

  const deleteMutation = useMutation({
    mutationFn: movimientoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
      alerts.success('Movimiento eliminado');
    }
  });

  const handleDelete = async (m: MovimientoDiario) => {
    if (await alerts.delete(`el movimiento a ${m.destino}`)) {
      deleteMutation.mutate(m.movimientoId);
    }
  };

  const handleEdit = (m: MovimientoDiario) => {
    setEditingMovimiento(m);
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'movimientoId', header: 'ID' },
    { key: 'fecha', header: 'Fecha', render: (m: MovimientoDiario) => new Date(m.fecha).toLocaleDateString() },
    { key: 'vehiculoId', header: 'Vehículo', render: (m: MovimientoDiario) => m.Vehiculo?.placa || `ID: ${m.vehiculoId}` },
    { key: 'conductorId', header: 'Conductor', render: (m: MovimientoDiario) => m.Conductor?.nombre || `ID: ${m.conductorId}` },
    { key: 'destino', header: 'Destino' },
    { key: 'kmSalida', header: 'Km Salida' },
    { key: 'kmLlegada', header: 'Km Llegada' },
    { key: 'horas', header: 'Horas' },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (m: MovimientoDiario) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(m)}>
            <Edit2 className="h-4 w-4 text-indigo-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(m)}>
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
          <h1 className="text-2xl font-bold text-gray-900">Movimiento Diario</h1>
          <p className="text-sm text-gray-500">Registro de salidas y llegadas</p>
        </div>
        <Button onClick={() => { setEditingMovimiento(null); setIsFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Nuevo Movimiento
        </Button>
      </div>

      <div className="flex gap-4 items-end max-w-md">
        <Input label="Desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        <Input label="Hasta" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={movimientosFiltrados}
            isLoading={isLoading}
            emptyMessage="No se encontraron movimientos."
            pageSize={15}
          />
        </CardContent>
      </Card>

      <MovimientoForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        movimiento={editingMovimiento}
      />
    </div>
  );
}
