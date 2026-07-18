import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Printer, FileText } from 'lucide-react';
import { vehiculoService } from '../../../services/vehiculo.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';

const ordenSchema = z.object({
  vehiculoId: z.coerce.number().min(1, 'Seleccione un vehículo'),
  conductorAsignado: z.string().min(2, 'Ingrese el nombre del conductor'),
  tipoCombustible: z.string().min(1, 'Seleccione tipo de combustible'),
  galonesAutorizados: z.coerce.number().min(0.1, 'Los galones deben ser mayor a 0'),
  motivo: z.string().min(2, 'Ingrese el motivo del abastecimiento'),
});

type OrdenFormData = z.infer<typeof ordenSchema>;

export default function EmitirOrden() {
  const [ordenGenerada, setOrdenGenerada] = useState<any>(null);

  const { data: vehiculos = [], isLoading } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrdenFormData>({
    resolver: zodResolver(ordenSchema),
    defaultValues: {
      tipoCombustible: 'DIESEL',
      galonesAutorizados: 0
    }
  });

  const onSubmit = (data: OrdenFormData) => {
    const v = vehiculos.find(x => x.vehiculoId === data.vehiculoId);
    setOrdenGenerada({
      ...data,
      vehiculoPlaca: v?.placa,
      fecha: new Date().toLocaleString(),
      numeroOrden: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    });
    alerts.success('Orden generada correctamente. Lista para impresión.');
    reset();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex justify-between items-center hide-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emitir Orden de Abastecimiento</h1>
          <p className="text-sm text-gray-500">Autorización previa emitida por el encargado de garaje.</p>
        </div>
        <div className="bg-amber-100 p-2 rounded-full">
          <FileText className="h-6 w-6 text-amber-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hide-print">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <Select 
                label="Vehículo a Abastecer" 
                {...register('vehiculoId')} 
                error={errors.vehiculoId?.message}
                options={[
                  { value: 0, label: 'Seleccione un vehículo...' },
                  ...vehiculos.map(v => ({ value: v.vehiculoId, label: `${v.placa} - ${v.codigoPatrimonio}` }))
                ]}
              />

              <Input 
                label="Conductor Asignado" 
                placeholder="Nombre del conductor autorizado"
                {...register('conductorAsignado')} 
                error={errors.conductorAsignado?.message} 
              />

              <div className="grid grid-cols-2 gap-4">
                <Select 
                  label="Tipo Combustible" 
                  {...register('tipoCombustible')} 
                  error={errors.tipoCombustible?.message}
                  options={[
                    { value: 'DIESEL', label: 'Diésel' },
                    { value: 'GASOLINA', label: 'Gasolina' },
                    { value: 'GNV', label: 'GNV' },
                    { value: 'LUBRICANTE', label: 'Lubricante' },
                  ]}
                />
                
                <Input 
                  label="Galones Autorizados" 
                  type="number"
                  step="0.1"
                  {...register('galonesAutorizados')} 
                  error={errors.galonesAutorizados?.message} 
                />
              </div>

              <Input 
                label="Motivo del Abastecimiento" 
                placeholder="Ej. Viaje a provincia, Ruta local, etc."
                {...register('motivo')} 
                error={errors.motivo?.message} 
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                Generar Orden
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sección de Vista Previa para Impresión */}
        {ordenGenerada ? (
          <div className="print-area">
            <Card className="border-2 border-amber-500 overflow-hidden print:border-none print:shadow-none">
              <div className="bg-amber-500 text-white p-4 text-center print:bg-gray-800">
                <h2 className="text-xl font-bold uppercase tracking-wider">Orden de Abastecimiento</h2>
                <p className="text-amber-100 print:text-gray-300">N° {ordenGenerada.numeroOrden}</p>
              </div>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase">Fecha de Emisión</span>
                    <strong className="text-gray-900">{ordenGenerada.fecha}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase">Placa del Vehículo</span>
                    <strong className="text-gray-900 text-lg">{ordenGenerada.vehiculoPlaca}</strong>
                  </div>
                  <div className="col-span-2 border-t border-gray-100 pt-4">
                    <span className="text-gray-500 block text-xs uppercase">Conductor Autorizado</span>
                    <strong className="text-gray-900">{ordenGenerada.conductorAsignado}</strong>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <span className="text-gray-500 block text-xs uppercase">Combustible</span>
                    <strong className="text-gray-900">{ordenGenerada.tipoCombustible}</strong>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <span className="text-gray-500 block text-xs uppercase">Cantidad (Galones)</span>
                    <strong className="text-gray-900">{ordenGenerada.galonesAutorizados} gal.</strong>
                  </div>
                  <div className="col-span-2 border-t border-gray-100 pt-4">
                    <span className="text-gray-500 block text-xs uppercase">Motivo</span>
                    <strong className="text-gray-900">{ordenGenerada.motivo}</strong>
                  </div>
                </div>

                <div className="mt-8 pt-12 border-t-2 border-dashed border-gray-300 grid grid-cols-2 gap-8 text-center">
                  <div>
                    <div className="border-b border-gray-800 w-32 mx-auto mb-2"></div>
                    <span className="text-xs font-semibold uppercase">Firma Encargado Garaje</span>
                  </div>
                  <div>
                    <div className="border-b border-gray-800 w-32 mx-auto mb-2"></div>
                    <span className="text-xs font-semibold uppercase">Firma Conductor</span>
                  </div>
                </div>

                <Button onClick={handlePrint} className="w-full mt-6 hide-print" variant="outline">
                  <Printer className="w-4 h-4 mr-2" /> Imprimir Orden
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg hide-print">
            <FileText className="h-12 w-12 text-gray-300 mb-3" />
            <p>Llena el formulario para generar una vista previa de la orden.</p>
          </div>
        )}
      </div>

      {/* Agregar estilos de impresión */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .hide-print {
            display: none !important;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
