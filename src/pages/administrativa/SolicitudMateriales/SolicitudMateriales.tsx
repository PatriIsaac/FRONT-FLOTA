import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Printer, Save, Trash2, Plus } from 'lucide-react';
import { almacenService } from '../../../services/almacen.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';

const solicitudSchema = z.object({
  ordenId: z.coerce.number().min(1, 'Seleccione la orden de servicio'),
  detalles: z.array(z.object({
    materialId: z.coerce.number().min(1, 'Seleccione un material'),
    cantidad: z.coerce.number().min(0.1, 'Mínimo 0.1')
  })).min(1, 'Agregue al menos 1 material')
});

type SolicitudFormData = z.infer<typeof solicitudSchema>;

export default function SolicitudMateriales() {
  const queryClient = useQueryClient();
  const [solicitudImprimible, setSolicitudImprimible] = useState<any>(null);

  const { data: ordenes = [] } = useQuery({
    queryKey: ['ordenes'],
    queryFn: async () => {
      const { api } = await import('../../../services/api');
      const { data } = await api.get('/mantenimientos/ordenes');
      return data;
    }
  });

  const { data: materiales = [] } = useQuery({
    queryKey: ['materiales'],
    queryFn: almacenService.getAllMateriales
  });

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm<SolicitudFormData>({
    resolver: zodResolver(solicitudSchema),
    defaultValues: {
      detalles: [{ materialId: 0, cantidad: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'detalles'
  });

  const createMutation = useMutation({
    mutationFn: almacenService.createSolicitud,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      alerts.success('Solicitud generada con éxito');
      setSolicitudImprimible(data);
      reset();
    }
  });

  const onSubmit = (data: SolicitudFormData) => {
    // Generar datos adicionales para el backend
    const payload = {
      numero: `SOL-MAT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      ordenId: data.ordenId,
      fecha: new Date().toISOString(),
      estado: 'PENDIENTE',
      detalles: data.detalles
    };
    createMutation.mutate(payload);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center hide-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registrar Solicitud de Materiales</h1>
          <p className="text-sm text-gray-500">Registro asociado a una orden de servicio (MA 113 01 01).</p>
        </div>
        <div className="bg-blue-100 p-2 rounded-full">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hide-print">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Select 
                label="Orden de Servicio Asociada" 
                {...register('ordenId')} 
                error={errors.ordenId?.message}
                options={[
                  { value: 0, label: 'Seleccione una orden...' },
                  ...ordenes.map((o: any) => ({ value: o.ordenId, label: `Orden N° ${o.numero} - Vehículo: ${o.vehiculo?.placa || ''}` }))
                ]}
              />

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Materiales y Repuestos</h3>
                  <Button type="button" size="sm" variant="outline" onClick={() => append({ materialId: 0, cantidad: 1 })}>
                    <Plus className="w-4 h-4 mr-2" /> Agregar Item
                  </Button>
                </div>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start mb-4">
                    <div className="flex-1">
                      <Select 
                        {...register(`detalles.${index}.materialId` as const)} 
                        options={[
                          { value: 0, label: 'Seleccione material...' },
                          ...materiales.map((m: any) => ({ value: m.materialId, label: `${m.codigo} - ${m.nombre} (${m.unidad})` }))
                        ]}
                      />
                    </div>
                    <div className="w-32">
                      <Input 
                        type="number" step="0.1"
                        {...register(`detalles.${index}.cantidad` as const)} 
                      />
                    </div>
                    <Button type="button" variant="ghost" className="mt-1 text-red-500" onClick={() => remove(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {errors.detalles && <p className="text-red-500 text-sm mt-1">{errors.detalles.message}</p>}
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" isLoading={createMutation.isPending}>
                <Save className="w-4 h-4 mr-2" /> Emitir y Generar Formato
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sección de Vista Previa para Impresión */}
        {solicitudImprimible ? (
          <div className="print-area">
            <Card className="border-2 border-blue-500 overflow-hidden print:border-none print:shadow-none">
              <div className="bg-blue-600 text-white p-4 text-center print:bg-gray-800">
                <h2 className="text-xl font-bold uppercase tracking-wider">Solicitud de Materiales de Almacén</h2>
                <p className="text-blue-100 print:text-gray-300">N° {solicitudImprimible.numero}</p>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase">Fecha de Solicitud</span>
                    <strong className="text-gray-900">{new Date(solicitudImprimible.fecha).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase">Orden de Servicio Relacionada</span>
                    <strong className="text-gray-900 text-lg">{solicitudImprimible.orden?.numero}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block text-xs uppercase">Vehículo</span>
                    <strong className="text-gray-900">{solicitudImprimible.orden?.vehiculo?.placa} - {solicitudImprimible.orden?.vehiculo?.codigoPatrimonio}</strong>
                  </div>
                </div>

                <table className="w-full text-left border-collapse text-sm mb-8">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Ítem</th>
                      <th className="p-2 border">Código</th>
                      <th className="p-2 border">Descripción</th>
                      <th className="p-2 border text-center">Unidad</th>
                      <th className="p-2 border text-center">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solicitudImprimible.detalles?.map((d: any, index: number) => (
                      <tr key={index}>
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">{d.material?.codigo}</td>
                        <td className="p-2 border">{d.material?.nombre}</td>
                        <td className="p-2 border text-center">{d.material?.unidad}</td>
                        <td className="p-2 border text-center font-bold">{d.cantidad}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-8 pt-12 border-t-2 border-dashed border-gray-300 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="border-b border-gray-800 w-24 mx-auto mb-2"></div>
                    <span className="text-[10px] font-semibold uppercase">Solicitante (Mecánico)</span>
                  </div>
                  <div>
                    <div className="border-b border-gray-800 w-24 mx-auto mb-2"></div>
                    <span className="text-[10px] font-semibold uppercase">Jefe de Mantenimiento</span>
                  </div>
                  <div>
                    <div className="border-b border-gray-800 w-24 mx-auto mb-2"></div>
                    <span className="text-[10px] font-semibold uppercase">Despachado por (Almacén)</span>
                  </div>
                </div>

                <Button onClick={handlePrint} className="w-full mt-6 hide-print" variant="outline">
                  <Printer className="w-4 h-4 mr-2" /> Imprimir Formato MA 113 01 01
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg hide-print">
            <FileText className="h-12 w-12 text-gray-300 mb-3" />
            <p>Llena el formulario para generar la solicitud y habilitar su impresión.</p>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .hide-print { display: none !important; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
