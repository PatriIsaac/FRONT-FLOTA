import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, Save, Trash2, DollarSign } from 'lucide-react';
import { costosService } from '../../../services/costos.service';
import { vehiculoService } from '../../../services/vehiculo.service';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';

const costoFijoSchema = z.object({
  vehiculoId: z.coerce.number().min(1, 'Seleccione vehículo'),
  mesAnio: z.string().min(6, 'Seleccione periodo'),
  cfp: z.coerce.number().min(0),
  cfv: z.coerce.number().min(0),
});

type CostoFijoFormData = z.infer<typeof costoFijoSchema>;

export default function ImportarCostosFijos() {
  const queryClient = useQueryClient();

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const { data: costosFijos = [], isLoading } = useQuery({
    queryKey: ['costosFijos'],
    queryFn: costosService.getAllFijos
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CostoFijoFormData>({
    resolver: zodResolver(costoFijoSchema),
    defaultValues: {
      cfp: 0,
      cfv: 0,
      mesAnio: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    }
  });

  const createMutation = useMutation({
    mutationFn: costosService.createFijo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costosFijos'] });
      alerts.success('Costo Fijo guardado');
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: costosService.deleteFijo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costosFijos'] });
      alerts.success('Registro eliminado');
    }
  });

  const onSubmit = (data: CostoFijoFormData) => {
    createMutation.mutate(data);
  };

  const columns = [
    { 
      key: 'vehiculo', 
      header: 'Vehículo',
      render: (d: any) => d.vehiculo ? `${d.vehiculo.placa}` : `ID: ${d.vehiculoId}`
    },
    { key: 'mesAnio', header: 'Periodo' },
    { key: 'cfp', header: 'Costo Fijo Personal (CFP)', render: (d: any) => `S/. ${d.cfp}` },
    { key: 'cfv', header: 'Costo Fijo Vehículo (CFV)', render: (d: any) => `S/. ${d.cfv}` },
    { 
      key: 'total', 
      header: 'Total CF Mensual', 
      render: (d: any) => <span className="font-bold text-gray-900">S/. {parseFloat(d.cfp) + parseFloat(d.cfv)}</span> 
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (d: any) => (
        <Button variant="ghost" size="sm" onClick={() => {
          if (confirm('¿Eliminar registro?')) deleteMutation.mutate(d.cfmId);
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
          <h1 className="text-2xl font-bold text-gray-900">Ingresar Costos Fijos</h1>
          <p className="text-sm text-gray-500">Carga del costo fijo provisto por Contabilidad de Costos (CFP y CFV).</p>
        </div>
        <div className="bg-emerald-100 p-2 rounded-full">
          <DollarSign className="h-6 w-6 text-emerald-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Registro Manual</CardTitle>
          </CardHeader>
          <CardContent>
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
              
              <Input 
                label="CFP (S/.)" 
                type="number" step="0.01"
                {...register('cfp')} 
                error={errors.cfp?.message} 
              />

              <Input 
                label="CFV (S/.)" 
                type="number" step="0.01"
                {...register('cfv')} 
                error={errors.cfv?.message} 
              />
              
              <Button type="submit" className="w-full mt-2" isLoading={createMutation.isPending}>
                <Save className="w-4 h-4 mr-2" /> Guardar Costos Fijos
              </Button>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-2">O importar masivamente:</p>
                <Button type="button" variant="outline" className="w-full" onClick={() => alert('Función de carga CSV próximamente activa.')}>
                  <Upload className="w-4 h-4 mr-2" /> Subir archivo CSV
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-0">
              <DataTable 
                columns={columns}
                data={costosFijos}
                isLoading={isLoading}
                emptyMessage="No hay costos fijos registrados."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
