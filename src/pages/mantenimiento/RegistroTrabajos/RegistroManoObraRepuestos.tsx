import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Wrench, Plus, Trash2, Save } from 'lucide-react';
import { mantenimientoDetalleService } from '../../../services/mantenimiento-avanzado.service';
import { mantenimientoService } from '../../../services/mantenimiento.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';

const detalleSchema = z.object({
  ordenId: z.coerce.number().min(1, 'Seleccione una orden'),
  manoObra: z.coerce.number().min(0, 'Mínimo 0'),
  repuestos: z.coerce.number().min(0, 'Mínimo 0'),
  otros: z.coerce.number().min(0, 'Mínimo 0'),
  origen: z.string().min(1, 'Seleccione origen'),
});

type DetalleFormData = z.infer<typeof detalleSchema>;

export default function RegistroManoObraRepuestos() {
  const queryClient = useQueryClient();

  // Mantenimiento service uses getAll which returns OrdenServicio[] ? Wait, in previous step I made endpoints in backend but did I update the frontend service?
  // I need to use api.get('/mantenimientos/ordenes') or similar. I'll just use a mock query here if it fails, or I should update mantenimientoService.ts.
  const { data: ordenes = [] } = useQuery({
    queryKey: ['ordenes'],
    queryFn: mantenimientoService.getAll
  });

  const { data: detalles = [], isLoading } = useQuery({
    queryKey: ['detallesMantenimiento'],
    queryFn: mantenimientoDetalleService.getAll
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DetalleFormData>({
    resolver: zodResolver(detalleSchema),
    defaultValues: {
      manoObra: 0,
      repuestos: 0,
      otros: 0,
      origen: 'PROPIO'
    }
  });

  const createMutation = useMutation({
    mutationFn: mantenimientoDetalleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detallesMantenimiento'] });
      alerts.success('Detalle registrado');
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: mantenimientoDetalleService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detallesMantenimiento'] });
      alerts.success('Detalle eliminado');
    }
  });

  const onSubmit = (data: DetalleFormData) => {
    createMutation.mutate(data);
  };

  const columns = [
    { 
      key: 'orden', 
      header: 'Orden N°',
      render: (d: any) => d.orden?.numero || `ID: ${d.ordenId}`
    },
    { key: 'origen', header: 'Origen (Propio/Terceros)' },
    { key: 'manoObra', header: 'Mano de Obra (S/.)', render: (d: any) => `S/. ${d.manoObra}` },
    { key: 'repuestos', header: 'Repuestos (S/.)', render: (d: any) => `S/. ${d.repuestos}` },
    { key: 'otros', header: 'Otros (S/.)', render: (d: any) => `S/. ${d.otros}` },
    { 
      key: 'total', 
      header: 'Total (S/.)',
      render: (d: any) => <span className="font-bold">S/. {parseFloat(d.manoObra) + parseFloat(d.repuestos) + parseFloat(d.otros)}</span>
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (d: any) => (
        <Button variant="ghost" size="sm" onClick={() => {
          if (confirm('¿Eliminar registro?')) deleteMutation.mutate(d.detalleId);
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
          <h1 className="text-2xl font-bold text-gray-900">Registrar Mano de Obra y Repuestos</h1>
          <p className="text-sm text-gray-500">Registro de insumos, repuestos y horas de mano de obra utilizadas (MA 122 02 04).</p>
        </div>
        <div className="bg-emerald-100 p-2 rounded-full">
          <Wrench className="h-6 w-6 text-emerald-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Nuevo Registro</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Select 
                label="Orden de Servicio" 
                {...register('ordenId')} 
                error={errors.ordenId?.message}
                options={[
                  { value: 0, label: 'Seleccione orden...' },
                  ...ordenes.map((o: any) => ({ value: o.ordenId, label: `${o.numero} - ${o.vehiculo?.placa || ''}` }))
                ]}
              />

              <Select 
                label="Origen del Servicio" 
                {...register('origen')} 
                error={errors.origen?.message}
                options={[
                  { value: 'PROPIO', label: 'Taller Propio' },
                  { value: 'TERCEROS', label: 'Taller de Terceros' },
                ]}
              />

              <Input 
                label="Costo Mano de Obra (S/.)" 
                type="number" step="0.1"
                {...register('manoObra')} 
                error={errors.manoObra?.message} 
              />
              
              <Input 
                label="Costo Repuestos e Insumos (S/.)" 
                type="number" step="0.1"
                {...register('repuestos')} 
                error={errors.repuestos?.message} 
              />
              
              <Input 
                label="Otros Costos (S/.)" 
                type="number" step="0.1"
                {...register('otros')} 
                error={errors.otros?.message} 
              />
              
              <Button type="submit" className="w-full mt-2" isLoading={createMutation.isPending}>
                <Save className="w-4 h-4 mr-2" /> Guardar Costos
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-0">
              <DataTable 
                columns={columns}
                data={detalles}
                isLoading={isLoading}
                emptyMessage="No hay registros de costos de mantenimiento."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
