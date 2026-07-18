import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { MapPin, Plus, Trash2, Edit2 } from 'lucide-react';
import { areaService } from '../../../services/area.service';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { alerts } from '../../../utils/alerts';
import AreaForm from './AreaForm';
import type { Area } from '../../../types/area';

export default function AreasList() {
  const queryClient = useQueryClient();
  const { data: areas = [], isLoading } = useQuery({ queryKey: ['areas'], queryFn: areaService.getAll });
  const { register, handleSubmit, reset } = useForm();
  const [editando, setEditando] = useState<Area | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const createMut = useMutation({
    mutationFn: areaService.create,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['areas']}); alerts.success('Área creada'); reset(); }
  });

  const deleteMut = useMutation({
    mutationFn: areaService.delete,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['areas']}); alerts.success('Área eliminada'); }
  });

  const handleDelete = async (d: any) => {
    if (await alerts.delete(`el área ${d.nombre}`)) {
      deleteMut.mutate(d.areaId);
    }
  };

  const columns = [
    { key: 'areaId', header: 'ID' },
    { key: 'nombre', header: 'Nombre del Área' },
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
        <div><h1 className="text-2xl font-bold text-gray-900">Áreas de Trabajo</h1><p className="text-sm text-gray-500">Gestión de áreas para asignación de flota.</p></div>
        <div className="bg-slate-100 p-2 rounded-full"><MapPin className="h-6 w-6 text-slate-600" /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader><CardTitle>Nueva Área</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((d: any) => createMut.mutate(d))} className="flex flex-col gap-5">
              <Input label="Nombre del Área" {...register('nombre', {required: true})} />
              <Button type="submit" className="w-full" isLoading={createMut.isPending}><Plus className="w-4 h-4 mr-2"/> Agregar Área</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent>
            <DataTable columns={columns} data={areas} isLoading={isLoading} emptyMessage="No hay áreas." enableColumnFilters={true} />
          </CardContent>
        </Card>
      </div>
      <AreaForm
        isOpen={modalAbierto}
        onClose={() => { setModalAbierto(false); setEditando(null); }}
        area={editando}
      />
    </div>
  );
}
