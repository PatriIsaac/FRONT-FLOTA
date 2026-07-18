import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Fuel, Plus, Trash2, Edit2 } from 'lucide-react';
import { servicentroService } from '../../../services/servicentro.service';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { alerts } from '../../../utils/alerts';
import ServicentroForm from './ServicentroForm';
import type { Servicentro } from '../../../types/servicentro';

export default function ServicentrosList() {
  const queryClient = useQueryClient();
  const { data: servicentros = [], isLoading } = useQuery({ queryKey: ['servicentros'], queryFn: servicentroService.getAll });
  const { register, handleSubmit, reset } = useForm();
  const [editando, setEditando] = useState<Servicentro | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const createMut = useMutation({
    mutationFn: servicentroService.create,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['servicentros']}); alerts.success('Grifo registrado'); reset(); }
  });

  const deleteMut = useMutation({
    mutationFn: servicentroService.delete,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['servicentros']}); alerts.success('Grifo eliminado'); }
  });

  const handleDelete = async (d: any) => {
    if (await alerts.delete(`el grifo ${d.nombre}`)) {
      deleteMut.mutate(d.servicentroId);
    }
  };

  const columns = [
    { key: 'servicentroId', header: 'ID' },
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
          <Button variant="ghost" size="sm" onClick={() => handleDelete(d)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">Grifos / Servicentros</h1><p className="text-sm text-gray-500">Proveedores de combustible.</p></div>
        <div className="bg-slate-100 p-2 rounded-full"><Fuel className="h-6 w-6 text-slate-600" /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader><CardTitle>Nuevo Grifo</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((d: any) => createMut.mutate(d))} className="flex flex-col gap-5">
              <Input label="Razón Social" {...register('nombre', {required: true})} />
              <Input label="RUC" {...register('ruc', {required: true})} />
              <Input label="Teléfono" {...register('telefono')} />
              <Input label="Dirección" {...register('direccion')} />
              <Button type="submit" className="w-full" isLoading={createMut.isPending}><Plus className="w-4 h-4 mr-2"/> Registrar Grifo</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent>
            <DataTable columns={columns} data={servicentros} isLoading={isLoading} emptyMessage="No hay grifos." enableColumnFilters={true} />
          </CardContent>
        </Card>
      </div>
      <ServicentroForm
        isOpen={modalAbierto}
        onClose={() => { setModalAbierto(false); setEditando(null); }}
        servicentro={editando}
      />
    </div>
  );
}
