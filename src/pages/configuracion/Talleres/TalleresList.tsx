import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Wrench, Plus, Trash2, Edit2 } from 'lucide-react';
import { tallerService } from '../../../services/taller.service';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { alerts } from '../../../utils/alerts';
import TallerForm from './TallerForm';
import type { Taller } from '../../../types/taller';

export default function TalleresList() {
  const queryClient = useQueryClient();
  const { data: talleres = [], isLoading } = useQuery({ queryKey: ['talleres'], queryFn: tallerService.getAll });
  const { register, handleSubmit, reset } = useForm();
  const [editando, setEditando] = useState<Taller | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const createMut = useMutation({
    mutationFn: tallerService.create,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['talleres']}); alerts.success('Taller registrado'); reset(); }
  });

  const deleteMut = useMutation({
    mutationFn: tallerService.delete,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['talleres']}); alerts.success('Taller eliminado'); }
  });

  const columns = [
    { key: 'tallerId', header: 'ID' },
    { key: 'nombre', header: 'Razón Social' },
    { key: 'ruc', header: 'RUC' },
    { key: 'telefono', header: 'Teléfono' },
    { key: 'direccion', header: 'Dirección' },
    {
      key: 'acciones', header: 'Acciones', render: (d: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setEditando(d); setModalAbierto(true); }}>
            <Edit2 className="w-4 h-4 text-indigo-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => deleteMut.mutate(d.tallerId)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">Talleres Externos</h1><p className="text-sm text-gray-500">Proveedores de mantenimiento.</p></div>
        <div className="bg-slate-100 p-2 rounded-full"><Wrench className="h-6 w-6 text-slate-600" /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader><CardTitle>Nuevo Taller</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((d: any) => createMut.mutate(d))} className="space-y-5">
              <Input label="Razón Social" {...register('nombre', {required: true})} />
              <Input label="RUC" {...register('ruc', {required: true})} />
              <Input label="Teléfono" {...register('telefono')} />
              <Input label="Dirección" {...register('direccion')} />
              <Button type="submit" className="w-full" isLoading={createMut.isPending}><Plus className="w-4 h-4 mr-2"/> Registrar Taller</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <DataTable columns={columns} data={talleres} isLoading={isLoading} emptyMessage="No hay talleres." />
          </CardContent>
        </Card>
      </div>
      <TallerForm
        isOpen={modalAbierto}
        onClose={() => { setModalAbierto(false); setEditando(null); }}
        taller={editando}
      />
    </div>
  );
}
