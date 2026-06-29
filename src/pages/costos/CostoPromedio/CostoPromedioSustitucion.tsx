import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calculator, Save, AlertTriangle, TrendingDown } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot
} from 'recharts';
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

  // Análisis de sustitución óptima (motor del backend, Figura 11)
  const [analisisVehiculoId, setAnalisisVehiculoId] = useState<number>(0);
  const { data: analisis, isFetching: analizando } = useQuery({
    queryKey: ['sustitucion', analisisVehiculoId],
    queryFn: () => costosService.getSustitucion(analisisVehiculoId),
    enabled: analisisVehiculoId > 0,
  });
  const puntoOptimo = analisis?.curva?.find((c: any) => c.anio === analisis.anioOptimo);

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

      {/* Análisis de sustitución óptima (curva Cpa por año, motor del backend) */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-end gap-4 max-w-md">
            <div className="flex-1">
              <Select
                label="Analizar edad óptima de sustitución (Figura 11)"
                value={analisisVehiculoId}
                onChange={(e) => setAnalisisVehiculoId(Number(e.target.value))}
                options={[
                  { value: 0, label: 'Seleccione vehículo...' },
                  ...vehiculos.map((v: any) => ({ value: v.vehiculoId, label: `${v.placa} - ${v.codigoPatrimonio}` }))
                ]}
              />
            </div>
          </div>

          {analizando && <p className="text-sm text-gray-500">Calculando curva...</p>}

          {analisis && (
            <>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-red-600 font-bold">
                  <TrendingDown className="w-4 h-4" /> Año óptimo de sustitución: {analisis.anioOptimo}
                </div>
                <div className="text-gray-600">Depreciación anual: S/. {analisis.depreciacionAnual}</div>
                <div className="text-gray-600">Mant. año base: S/. {analisis.mantenimientoAnioBase}</div>
                <div className="text-gray-600">Factor crecimiento: {analisis.factorCrecimiento}</div>
              </div>

              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analisis.curva}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="anio" label={{ value: 'Año de vida útil', position: 'insideBottom', offset: -2, fontSize: 12 }} tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: any) => `S/. ${Number(v).toFixed(2)}`} />
                    <Line type="monotone" dataKey="costoPromedioAnual" stroke="#d97706" strokeWidth={2.5} name="Cpa (S/.)" dot={{ r: 3 }} />
                    {puntoOptimo && (
                      <ReferenceDot x={puntoOptimo.anio} y={puntoOptimo.costoPromedioAnual} r={6} fill="#ef4444" stroke="white" />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </CardContent>
      </Card>

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
