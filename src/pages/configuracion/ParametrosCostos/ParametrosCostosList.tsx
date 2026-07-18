import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Calculator } from 'lucide-react';
import { costoService } from '../../../services/costo.service';
import type { CostoFijoMensual } from '../../../types/costo';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { DataTable } from '../../../components/ui/DataTable';
import { alerts } from '../../../utils/alerts';
import ParametroCostoForm from './ParametroCostoForm';
import ImportarCSVModal from './ImportarCSVModal';

export default function ParametrosCostosList() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingCosto, setEditingCosto] = useState<CostoFijoMensual | null>(null);
  const queryClient = useQueryClient();

  const { data: costos = [], isLoading } = useQuery({
    queryKey: ['costos'],
    queryFn: costoService.getAll,
    retry: false
  });

  const deleteMutation = useMutation({
    mutationFn: costoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costos'] });
      alerts.success('Registro eliminado');
    },
    onError: (error: any) => {
      alerts.error(error.response?.data?.message || 'Error al eliminar');
    }
  });

  const handleDelete = async (c: CostoFijoMensual) => {
    if (await alerts.delete(`el parámetro del mes ${c.mesAnio}`)) {
      deleteMutation.mutate(c.cfmId);
    }
  };

  const handleEdit = (c: CostoFijoMensual) => {
    setEditingCosto(c);
    setIsFormOpen(true);
  };

  const columns = [
    { key: 'mesAnio', header: 'Periodo (Mes/Año)' },
    { 
      key: 'vehiculo', 
      header: 'Vehículo',
      render: (c: CostoFijoMensual) => c.vehiculo ? `${c.vehiculo.placa} (${c.vehiculo.codigoPatrimonio})` : `ID: ${c.vehiculoId}`
    },
    { 
      key: 'cfp', 
      header: 'CFP',
      render: (c: CostoFijoMensual) => `S/. ${Number(c.cfp).toFixed(2)}`
    },
    { 
      key: 'cfv', 
      header: 'CFV',
      render: (c: CostoFijoMensual) => `S/. ${Number(c.cfv).toFixed(2)}`
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (c: CostoFijoMensual) => (
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
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parámetros de Costos (CFP/CFV)</h1>
          <p className="text-sm text-gray-500">Ingreso de Costo Fijo Provisto por Contabilidad de Costos.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setIsImportOpen(true)}>
            <Calculator className="h-4 w-4 mr-2" /> Importar CSV
          </Button>
          <Button onClick={() => { setEditingCosto(null); setIsFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Nuevo Registro
          </Button>
        </div>
      </div>

      <Card>
        <CardContent>
          {!isLoading && costos.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Calculator className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Sin parámetros registrados</h3>
              <p className="mt-1 text-sm text-gray-500 mb-6">
                Ingresa los costos fijos y variables mensuales por vehículo.
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Registrar Costos
              </Button>
            </div>
          ) : (
            <DataTable 
              columns={columns}
              data={costos}
              isLoading={isLoading}
              emptyMessage="No se encontraron registros."
              enableColumnFilters={true}
            />
          )}
        </CardContent>
      </Card>

      <ParametroCostoForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        costo={editingCosto}
      />

      <ImportarCSVModal 
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
    </div>
  );
}
