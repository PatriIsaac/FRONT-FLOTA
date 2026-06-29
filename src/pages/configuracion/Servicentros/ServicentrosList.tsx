import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Fuel, Plus, Trash2 } from 'lucide-react';
import { servicentroService } from '../../../services/servicentro.service';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { alerts } from '../../../utils/alerts';

export default function ServicentrosList() {
  const queryClient = useQueryClient();
  const { data: servicentros = [], isLoading } = useQuery({ queryKey: ['servicentros'], queryFn: servicentroService.getAll });
  const { register, handleSubmit, reset } = useForm();

  const createMut = useMutation({
    mutationFn: servicentroService.create,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['servicentros']}); alerts.success('Grifo registrado'); reset(); }
  });
  
  const deleteMut = useMutation({
    mutationFn: servicentroService.delete,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['servicentros']}); alerts.success('Grifo eliminado'); }
  });

  const columns = [
    { key: 'servicentroId', header: 'ID' },
    { key: 'nombre', header: 'Razón Social' },
    { key: 'ruc', header: 'RUC' },
    { key: 'telefono', header: 'Teléfono' },
    { key: 'direccion', header: 'Dirección' },
    { key: 'acciones', header: 'Acciones', render: (d: any) => <Button variant="ghost" size="sm" onClick={() => deleteMut.mutate(d.servicentroId)}><Trash2 className="w-4 h-4 text-red-500"/></Button> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">Grifos / Servicentros</h1><p className="text-sm text-gray-500">Proveedores de combustible.</p></div>
        <div className="bg-slate-100 p-2 rounded-full"><Fuel className="h-6 w-6 text-slate-600" /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader><CardTitle>Nuevo Grifo</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((d: any) => createMut.mutate(d))} className="space-y-4">
              <Input label="Razón Social" {...register('nombre', {required: true})} />
              <Input label="RUC" {...register('ruc', {required: true})} />
              <Input label="Teléfono" {...register('telefono')} />
              <Input label="Dirección" {...register('direccion')} />
              <Button type="submit" className="w-full" isLoading={createMut.isPending}><Plus className="w-4 h-4 mr-2"/> Registrar Grifo</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <DataTable columns={columns} data={servicentros} isLoading={isLoading} emptyMessage="No hay grifos." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
