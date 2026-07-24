import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Trash2, PieChart } from 'lucide-react';
import { indicadorService } from '../../../services/indicador.service';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';

const indicadorSchema = z.object({
  codigo: z.string().min(2, 'Código es requerido'),
  nombre: z.string().min(3, 'Nombre es requerido'),
  valor: z.coerce.number(),
  periodo: z.string().min(4, 'Periodo requerido (Ej. 2026-06)'),
});

type IndicadorFormData = z.infer<typeof indicadorSchema>;

export default function GeneradorIndicadores() {
  const queryClient = useQueryClient();

  const { data: indicadores = [], isLoading } = useQuery({
    queryKey: ['indicadores'],
    queryFn: indicadorService.getAll
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IndicadorFormData>({
    resolver: zodResolver(indicadorSchema) as any,
    defaultValues: {
      valor: 0,
      periodo: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
    }
  });

  const createMutation = useMutation({
    mutationFn: indicadorService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicadores'] });
      alerts.success('Indicador guardado');
      reset();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: indicadorService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indicadores'] });
      alerts.success('Indicador eliminado');
    }
  });

  const onSubmit = (data: IndicadorFormData) => {
    createMutation.mutate(data);
  };

  const columns = [
    { key: 'codigo', header: 'Código' },
    { key: 'nombre', header: 'Indicador' },
    { key: 'periodo', header: 'Periodo' },
    { 
      key: 'valor', 
      header: 'Valor',
      render: (d: any) => <span className="font-bold text-emerald-600">{d.valor}</span>
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (d: any) => (
        <Button variant="ghost" size="sm" onClick={() => {
          if (confirm('¿Eliminar indicador?')) deleteMutation.mutate(d.indicadorId);
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
          <h1 className="text-2xl font-bold text-gray-900">Generar Indicadores (VA / IA)</h1>
          <p className="text-sm text-gray-500">Generación de indicadores de consumo, mantenimiento en terceros e índice de utilización.</p>
        </div>
        <div className="bg-emerald-100 p-2 rounded-full">
          <PieChart className="h-6 w-6 text-emerald-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Registrar Indicador</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <Select 
                label="Tipo de Indicador" 
                {...register('codigo')} 
                error={errors.codigo?.message}
                options={[
                  { value: '', label: 'Seleccione un tipo...' },
                  { value: 'IND-VA', label: 'VA - Variación Anual' },
                  { value: 'IND-IA', label: 'IA - Índice de Afectación' },
                  { value: 'IND-IUV', label: 'IUV - Índice Utilización Flota' },
                  { value: 'IND-REND', label: 'REND - Rendimiento Promedio' }
                ]}
              />

              <Input 
                label="Nombre/Descripción" 
                placeholder="Ej. IA de Terceros"
                {...register('nombre')} 
                error={errors.nombre?.message} 
              />
              
              <Input 
                label="Periodo Evaluado" 
                type="month"
                {...register('periodo')} 
                error={errors.periodo?.message} 
              />
              
              <Input 
                label="Valor del Indicador" 
                type="number" step="0.01"
                {...register('valor')} 
                error={errors.valor?.message} 
              />
              
              <Button type="submit" className="w-full mt-2" isLoading={createMutation.isPending}>
                <Save className="w-4 h-4 mr-2" /> Guardar Indicador
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent>
              <DataTable 
                columns={columns}
                data={indicadores}
                isLoading={isLoading}
                emptyMessage="No hay indicadores registrados."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
