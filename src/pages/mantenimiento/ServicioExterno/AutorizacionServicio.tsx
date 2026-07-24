import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Printer, PenTool } from 'lucide-react';
import { vehiculoService } from '../../../services/vehiculo.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';

const autorizacionSchema = z.object({
  vehiculoId: z.coerce.number().min(1, 'Seleccione un vehículo'),
  tallerDestino: z.string().min(2, 'Ingrese el nombre del taller'),
  descripcionServicio: z.string().min(5, 'Describa el servicio a realizar'),
  presupuestoAproximado: z.coerce.number().min(0, 'Debe ser un valor positivo'),
});

type AutorizacionFormData = z.infer<typeof autorizacionSchema>;

export default function AutorizacionServicio() {
  const [autorizacion, setAutorizacion] = useState<any>(null);

  const { data: vehiculos = [], isLoading } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AutorizacionFormData>({
    resolver: zodResolver(autorizacionSchema) as any,
    defaultValues: {
      presupuestoAproximado: 0
    }
  });

  const onSubmit = (data: AutorizacionFormData) => {
    const v = vehiculos.find(x => x.vehiculoId === data.vehiculoId);
    setAutorizacion({
      ...data,
      vehiculoPlaca: v?.placa,
      fechaEmision: new Date().toLocaleDateString(),
      numeroAutorizacion: `AUT-EXT-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    });
    alerts.success('Autorización generada. Lista para imprimir.');
    reset();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex justify-between items-center hide-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Autorizar Servicio Externo</h1>
          <p className="text-sm text-gray-500">Autorización de servicio para mantenimiento en taller de terceros.</p>
        </div>
        <div className="bg-emerald-100 p-2 rounded-full">
          <PenTool className="h-6 w-6 text-emerald-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hide-print">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <Select 
                label="Vehículo" 
                {...register('vehiculoId')} 
                error={errors.vehiculoId?.message}
                options={[
                  { value: 0, label: 'Seleccione un vehículo...' },
                  ...vehiculos.map(v => ({ value: v.vehiculoId, label: `${v.placa} - ${v.codigoPatrimonio}` }))
                ]}
              />

              <Input 
                label="Taller Destino (Tercero)" 
                placeholder="Nombre de la empresa o taller"
                {...register('tallerDestino')} 
                error={errors.tallerDestino?.message} 
              />

              <Input 
                label="Descripción del Servicio Requerido" 
                placeholder="Ej. Cambio de fajas, Reparación de frenos..."
                {...register('descripcionServicio')} 
                error={errors.descripcionServicio?.message} 
              />
              
              <Input 
                label="Presupuesto Aproximado (US$)" 
                type="number"
                step="0.1"
                {...register('presupuestoAproximado')} 
                error={errors.presupuestoAproximado?.message} 
              />
              
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                Generar Autorización
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sección de Vista Previa para Impresión */}
        {autorizacion ? (
          <div className="print-area">
            <Card className="border-2 border-emerald-500 overflow-hidden print:border-none print:shadow-none">
              <div className="bg-emerald-600 text-white p-4 text-center print:bg-gray-800">
                <h2 className="text-xl font-bold uppercase tracking-wider">Autorización de Servicio Externo</h2>
                <p className="text-emerald-100 print:text-gray-300">N° {autorizacion.numeroAutorizacion}</p>
              </div>
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs uppercase">Fecha de Emisión</span>
                    <strong className="text-gray-900">{autorizacion.fechaEmision}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs uppercase">Placa de Unidad</span>
                    <strong className="text-gray-900 text-lg">{autorizacion.vehiculoPlaca}</strong>
                  </div>
                  <div className="col-span-2 border-t border-gray-100 pt-4">
                    <span className="text-gray-500 block text-xs uppercase">Taller Autorizado</span>
                    <strong className="text-gray-900">{autorizacion.tallerDestino}</strong>
                  </div>
                  <div className="col-span-2 border-t border-gray-100 pt-4">
                    <span className="text-gray-500 block text-xs uppercase">Descripción del Trabajo a Realizar</span>
                    <p className="text-gray-900 font-medium whitespace-pre-wrap">{autorizacion.descripcionServicio}</p>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <span className="text-gray-500 block text-xs uppercase">Monto Aprox. Aprobado</span>
                    <strong className="text-gray-900">US$ {autorizacion.presupuestoAproximado}</strong>
                  </div>
                </div>

                <div className="mt-8 pt-12 border-t-2 border-dashed border-gray-300 grid grid-cols-2 gap-8 text-center">
                  <div>
                    <div className="border-b border-gray-800 w-32 mx-auto mb-2"></div>
                    <span className="text-xs font-semibold uppercase">Jefatura de Mantenimiento</span>
                  </div>
                  <div>
                    <div className="border-b border-gray-800 w-32 mx-auto mb-2"></div>
                    <span className="text-xs font-semibold uppercase">Gerencia / Administración</span>
                  </div>
                </div>

                <Button onClick={handlePrint} className="w-full mt-6 hide-print" variant="outline">
                  <Printer className="w-4 h-4 mr-2" /> Imprimir Documento
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-12 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg hide-print">
            <PenTool className="h-12 w-12 text-gray-300 mb-3" />
            <p>Llena el formulario para generar una vista previa de la autorización de servicio.</p>
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
