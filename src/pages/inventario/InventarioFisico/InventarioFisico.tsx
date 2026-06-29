import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClipboardList, Save, Trash2 } from 'lucide-react';
import { inventarioService } from '../../../services/inventario.service';
import { vehiculoService } from '../../../services/vehiculo.service';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';

const inventarioSchema = z.object({
  vehiculoId: z.coerce.number().min(1, 'Seleccione vehículo'),
  fecha: z.string().min(10, 'Fecha requerida'),
  estadoGeneral: z.string().min(2, 'Estado requerido'),
  kmHorasLectura: z.coerce.number().min(0, 'Debe ser positivo'),
  observaciones: z.string().optional()
});

type InventarioFormData = z.infer<typeof inventarioSchema>;

export default function InventarioFisico() {
  const queryClient = useQueryClient();

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const { data: inventarios = [], isLoading } = useQuery({
    queryKey: ['inventarioFisico'],
    queryFn: inventarioService.getAllInventarioFisico
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InventarioFormData>({
    resolver: zodResolver(inventarioSchema),
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
      kmHorasLectura: 0,
      observaciones: ''
    }
  });

  const createMutation = useMutation({
    mutationFn: inventarioService.createInventarioFisico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventarioFisico'] });
      alerts.success('Inventario registrado');
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: inventarioService.deleteInventarioFisico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventarioFisico'] });
      alerts.success('Registro eliminado');
    }
  });

  const onSubmit = (data: InventarioFormData) => {
    // Añadir tiempo a la fecha para que sea ISO 8601 en BD
    createMutation.mutate({
      ...data,
      fecha: new Date(data.fecha).toISOString()
    });
  };

  const columns = [
    { key: 'fecha', header: 'Fecha Auditoría', render: (d: any) => new Date(d.fecha).toLocaleDateString() },
    { key: 'vehiculo', header: 'Vehículo', render: (d: any) => d.vehiculo ? `${d.vehiculo.placa}` : `ID: ${d.vehiculoId}` },
    { key: 'kmHorasLectura', header: 'Km / H. Lectura', render: (d: any) => d.kmHorasLectura.toLocaleString() },
    { 
      key: 'estadoGeneral', 
      header: 'Estado General',
      render: (d: any) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          d.estadoGeneral === 'OPERATIVO' ? 'bg-emerald-100 text-emerald-800' :
          d.estadoGeneral === 'MANTENIMIENTO' ? 'bg-amber-100 text-amber-800' :
          'bg-red-100 text-red-800'
        }`}>
          {d.estadoGeneral}
        </span>
      )
    },
    { key: 'observaciones', header: 'Observaciones' },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (d: any) => (
        <Button variant="ghost" size="sm" onClick={() => {
          if (confirm('¿Eliminar registro de inventario?')) deleteMutation.mutate(d.inventarioId);
        }}>
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventario Físico de Flota</h1>
          <p className="text-sm text-gray-500">Registro de inspecciones y estado real de los vehículos.</p>
        </div>
        <div className="bg-cyan-100 p-2 rounded-full">
          <ClipboardList className="h-6 w-6 text-cyan-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Auditoría / Inspección</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Select 
                label="Vehículo Auditado" 
                {...register('vehiculoId')} 
                error={errors.vehiculoId?.message}
                options={[
                  { value: 0, label: 'Seleccione vehículo...' },
                  ...vehiculos.map((v: any) => ({ value: v.vehiculoId, label: `${v.placa} - ${v.codigoPatrimonio}` }))
                ]}
              />

              <Input 
                label="Fecha de Inspección" 
                type="date"
                {...register('fecha')} 
                error={errors.fecha?.message} 
              />
              
              <Input 
                label="Lectura Km/H actual" 
                type="number" step="0.1"
                {...register('kmHorasLectura')} 
                error={errors.kmHorasLectura?.message} 
              />

              <Select 
                label="Estado Físico Verificado" 
                {...register('estadoGeneral')} 
                error={errors.estadoGeneral?.message}
                options={[
                  { value: '', label: 'Seleccione estado...' },
                  { value: 'OPERATIVO', label: 'Operativo' },
                  { value: 'MANTENIMIENTO', label: 'En Mantenimiento' },
                  { value: 'INOPERATIVO', label: 'Inoperativo / De Baja' }
                ]}
              />
              
              <Input 
                label="Observaciones Relevantes" 
                placeholder="Falta llanta de repuesto, faro roto..."
                {...register('observaciones')} 
                error={errors.observaciones?.message} 
              />
              
              <Button type="submit" className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700" isLoading={createMutation.isPending}>
                <Save className="w-4 h-4 mr-2" /> Registrar Inspección
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-0">
              <DataTable 
                columns={columns}
                data={inventarios}
                isLoading={isLoading}
                emptyMessage="No hay registros de inventario físico."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
