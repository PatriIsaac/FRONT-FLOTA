import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calculator, Save, Trash2 } from 'lucide-react';
import { mantenimientoMensualService } from '../../../services/mantenimiento-avanzado.service';
import { vehiculoService } from '../../../services/vehiculo.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';

const registroSchema = z.object({
  vehiculoId: z.coerce.number().min(1, 'Seleccione vehículo'),
  mesAnio: z.string().min(6, 'Seleccione periodo'),
  propio: z.coerce.number().min(0),
  terceros: z.coerce.number().min(0),
});

type RegistroFormData = z.infer<typeof registroSchema>;

export default function RegistroCostoMensual() {
  const queryClient = useQueryClient();

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const { data: registros = [], isLoading } = useQuery({
    queryKey: ['registrosMensuales'],
    queryFn: mantenimientoMensualService.getAll
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema) as any,
    defaultValues: {
      propio: 0,
      terceros: 0,
      mesAnio: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    }
  });

  const createMutation = useMutation({
    mutationFn: mantenimientoMensualService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrosMensuales'] });
      alerts.success('Registro mensual guardado');
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: mantenimientoMensualService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrosMensuales'] });
      alerts.success('Registro eliminado');
    }
  });

  const onSubmit = (data: RegistroFormData) => {
    createMutation.mutate(data);
  };

  const columns = [
    { 
      key: 'vehiculo', 
      header: 'Vehículo',
      render: (d: any) => (d.Vehiculo ?? d.vehiculo) ? `${(d.Vehiculo ?? d.vehiculo).placa} (${(d.Vehiculo ?? d.vehiculo).codigoPatrimonio})` : `ID: ${d.vehiculoId}`
    },
    { key: 'mesAnio', header: 'Periodo' },
    { key: 'propio', header: 'Costo Propio (US$)', render: (d: any) => `US$ ${d.propio}` },
    { key: 'terceros', header: 'Costo Terceros (US$)', render: (d: any) => `US$ ${d.terceros}` },
    { 
      key: 'total', 
      header: 'Total Mensual (US$)',
      render: (d: any) => <span className="font-bold text-gray-900">US$ {Number(d.propio || 0) + Number(d.terceros || 0)}</span>
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (d: any) => (
        <Button variant="ghost" size="sm" onClick={() => {
          if (confirm('¿Eliminar registro consolidado?')) deleteMutation.mutate(d.registroId);
        }}>
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registrar Costo Mensual</h1>
          <p className="text-sm text-gray-500">Consolidación de los costos de mantenimiento del periodo.</p>
        </div>
        <div className="bg-emerald-100 p-2 rounded-full">
          <Calculator className="h-6 w-6 text-emerald-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Guardar Consolidado</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <Select 
                label="Vehículo" 
                {...register('vehiculoId')} 
                error={errors.vehiculoId?.message}
                options={[
                  { value: 0, label: 'Seleccione vehículo...' },
                  ...vehiculos.map((v: any) => ({ value: v.vehiculoId, label: `${v.placa} - ${v.codigoPatrimonio}` }))
                ]}
              />

              <Input 
                label="Periodo (Mes/Año)" 
                type="month"
                {...register('mesAnio')} 
                error={errors.mesAnio?.message} 
              />

              <Input 
                label="Costo Taller Propio (US$)" 
                type="number" step="0.1"
                {...register('propio')} 
                error={errors.propio?.message} 
              />
              
              <Input 
                label="Costo Taller Terceros (US$)" 
                type="number" step="0.1"
                {...register('terceros')} 
                error={errors.terceros?.message} 
              />
              
              <Button type="submit" className="w-full mt-2" isLoading={createMutation.isPending}>
                <Save className="w-4 h-4 mr-2" /> Guardar Costo Mensual
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent>
              <DataTable
            enableColumnFilters={true} 
                columns={columns}
                data={registros}
                isLoading={isLoading}
                emptyMessage="No hay registros mensuales de costos."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
