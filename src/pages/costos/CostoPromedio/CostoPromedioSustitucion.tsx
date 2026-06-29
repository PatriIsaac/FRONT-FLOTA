import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calculator, Save, AlertTriangle } from 'lucide-react';
import { costosService } from '../../../services/costos.service';
import { vehiculoService } from '../../../services/vehiculo.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';

const costoPromedioSchema = z.object({
  vehiculoId: z.coerce.number().min(1, 'Seleccione vehículo'),
  eniaN: z.coerce.number().min(1, 'Mínimo 1 año'),
  depreciacion: z.coerce.number().min(0),
  remanenteAcumulado: z.coerce.number().min(0),
  costoPromedioAnual: z.coerce.number().min(0),
});

type CostoPromedioFormData = z.infer<typeof costoPromedioSchema>;

export default function CostoPromedioSustitucion() {
  const queryClient = useQueryClient();

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const { data: costosPromedio = [], isLoading } = useQuery({
    queryKey: ['costosPromedioAnual'],
    queryFn: costosService.getAllPromedioAnual
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CostoPromedioFormData>({
    resolver: zodResolver(costoPromedioSchema),
    defaultValues: {
      eniaN: 1,
      depreciacion: 0,
      remanenteAcumulado: 0,
      costoPromedioAnual: 0
    }
  });

  const createMutation = useMutation({
    mutationFn: costosService.createPromedioAnual,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costosPromedioAnual'] });
      alerts.success('Costo Promedio guardado');
      reset();
    }
  });

  const onSubmit = (data: CostoPromedioFormData) => {
    createMutation.mutate(data);
  };

  const columns = [
    { 
      key: 'vehiculo', 
      header: 'Vehículo',
      render: (d: any) => d.vehiculo ? `${d.vehiculo.placa} (Vida útil: ${d.vehiculo.vidaUtilAnios} años)` : `ID: ${d.vehiculoId}`
    },
    { key: 'eniaN', header: 'Año Evaluado (N)' },
    { key: 'depreciacion', header: 'Depreciación (S/.)', render: (d: any) => `S/. ${d.depreciacion}` },
    { key: 'remanenteAcumulado', header: 'Remanente Acum. (S/.)', render: (d: any) => `S/. ${d.remanenteAcumulado}` },
    { 
      key: 'costoPromedioAnual', 
      header: 'Costo Prom. Anual (Cpa)', 
      render: (d: any) => <span className="font-bold text-gray-900">S/. {d.costoPromedioAnual}</span> 
    },
    {
      key: 'estado',
      header: 'Evaluación',
      render: (d: any) => {
        const esOptimo = d.eniaN >= (d.vehiculo?.vidaUtilAnios || 5);
        return esOptimo ? (
          <span className="text-red-600 font-bold flex items-center"><AlertTriangle className="w-4 h-4 mr-1" /> Sustituir</span>
        ) : (
          <span className="text-emerald-600 font-bold">Operativo</span>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Costo Promedio Anual (Cpa)</h1>
          <p className="text-sm text-gray-500">Cálculo del costo promedio anual y evaluación de la edad óptima de sustitución — Ec. 11.</p>
        </div>
        <div className="bg-amber-100 p-2 rounded-full">
          <Calculator className="h-6 w-6 text-amber-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Guardar Cpa Evaluado</h3>
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
                label="Año de Evaluación (N)" 
                type="number"
                {...register('eniaN')} 
                error={errors.eniaN?.message} 
              />

              <Input 
                label="Depreciación (S/.)" 
                type="number" step="0.01"
                {...register('depreciacion')} 
                error={errors.depreciacion?.message} 
              />
              
              <Input 
                label="Costo Remanente Acum. (S/.)" 
                type="number" step="0.01"
                {...register('remanenteAcumulado')} 
                error={errors.remanenteAcumulado?.message} 
              />
              
              <Input 
                label="Costo Promedio Anual Resultante (S/.)" 
                type="number" step="0.01"
                {...register('costoPromedioAnual')} 
                error={errors.costoPromedioAnual?.message} 
              />
              
              <Button type="submit" className="w-full mt-2 bg-amber-600 hover:bg-amber-700" isLoading={createMutation.isPending}>
                <Save className="w-4 h-4 mr-2" /> Actualizar Cpa del Vehículo
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-0">
              <DataTable 
                columns={columns}
                data={costosPromedio}
                isLoading={isLoading}
                emptyMessage="No hay costos promedio registrados."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
