import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TrendingDown, Save, Trash2 } from 'lucide-react';
import { costosService } from '../../../services/costos.service';
import { vehiculoService } from '../../../services/vehiculo.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';

const costoVariableSchema = z.object({
  vehiculoId: z.coerce.number().min(1, 'Seleccione vehículo'),
  mesAnio: z.string().min(6, 'Seleccione periodo'),
  kmHoras: z.coerce.number().min(0),
  cvv: z.coerce.number().min(0),
  ckv: z.coerce.number().min(0),
  consumo: z.coerce.number().min(0),
  iuv: z.coerce.number().min(0),
});

type CostoVariableFormData = z.infer<typeof costoVariableSchema>;

export default function CostoVariable() {
  const queryClient = useQueryClient();

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const { data: costosOperacion = [], isLoading } = useQuery({
    queryKey: ['costosOperacion'],
    queryFn: costosService.getAllOperacion
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CostoVariableFormData>({
    resolver: zodResolver(costoVariableSchema),
    defaultValues: {
      kmHoras: 0,
      cvv: 0,
      ckv: 0,
      consumo: 0,
      iuv: 0,
      mesAnio: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    }
  });

  const createMutation = useMutation({
    mutationFn: costosService.createOperacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costosOperacion'] });
      alerts.success('Costo Variable guardado');
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: costosService.deleteOperacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costosOperacion'] });
      alerts.success('Registro eliminado');
    }
  });

  const onSubmit = (data: CostoVariableFormData) => {
    createMutation.mutate(data);
  };

  const columns = [
    { 
      key: 'vehiculo', 
      header: 'Vehículo',
      render: (d: any) => d.vehiculo ? `${d.vehiculo.placa}` : `ID: ${d.vehiculoId}`
    },
    { key: 'mesAnio', header: 'Periodo' },
    { key: 'kmHoras', header: 'Km / Horas' },
    { key: 'cvv', header: 'CVV (S/.)', render: (d: any) => `S/. ${d.cvv}` },
    { key: 'ckv', header: 'CKV (S/./Km)', render: (d: any) => `S/. ${d.ckv}` },
    { key: 'consumo', header: 'Consumo (gal)' },
    { key: 'iuv', header: 'IUV (%)', render: (d: any) => `${d.iuv}%` },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (d: any) => (
        <Button variant="ghost" size="sm" onClick={() => {
          if (confirm('¿Eliminar registro?')) deleteMutation.mutate(d.comId);
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
          <h1 className="text-2xl font-bold text-gray-900">Costo Variable y CKV</h1>
          <p className="text-sm text-gray-500">Cálculo del costo variable del vehículo (CVV) y el costo por kilómetro (CKV) — Ec. 1.</p>
        </div>
        <div className="bg-red-100 p-2 rounded-full">
          <TrendingDown className="h-6 w-6 text-red-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Registrar CVV y CKV</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Km o Horas" 
                  type="number" step="0.1"
                  {...register('kmHoras')} 
                  error={errors.kmHoras?.message} 
                />
                
                <Input 
                  label="Consumo (gal)" 
                  type="number" step="0.1"
                  {...register('consumo')} 
                  error={errors.consumo?.message} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="CVV (S/.)" 
                  type="number" step="0.01"
                  {...register('cvv')} 
                  error={errors.cvv?.message} 
                />
                
                <Input 
                  label="CKV (S/./Km)" 
                  type="number" step="0.01"
                  {...register('ckv')} 
                  error={errors.ckv?.message} 
                />
              </div>
              
              <Input 
                label="IUV (%)" 
                type="number" step="0.01"
                {...register('iuv')} 
                error={errors.iuv?.message} 
              />
              
              <Button type="submit" className="w-full mt-2 bg-red-600 hover:bg-red-700" isLoading={createMutation.isPending}>
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
                data={costosOperacion}
                isLoading={isLoading}
                emptyMessage="No hay registros de costos de operación."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
