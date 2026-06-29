import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Shield, Plus, Trash2 } from 'lucide-react';
import { usuarioService } from '../../../services/usuario.service';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { alerts } from '../../../utils/alerts';

export default function RolesList() {
  const queryClient = useQueryClient();
  const { data: roles = [], isLoading } = useQuery({ queryKey: ['roles'], queryFn: usuarioService.getAllRoles });
  const { register, handleSubmit, reset } = useForm();

  const createMut = useMutation({
    mutationFn: usuarioService.createRol,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['roles']}); alerts.success('Rol registrado'); reset(); }
  });
  
  const deleteMut = useMutation({
    mutationFn: usuarioService.deleteRol,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['roles']}); alerts.success('Rol eliminado'); }
  });

  const columns = [
    { key: 'rolId', header: 'ID' },
    { key: 'nombre', header: 'Nombre del Rol' },
    { key: 'descripcion', header: 'Descripción' },
    { key: 'acciones', header: 'Acciones', render: (d: any) => <Button variant="ghost" size="sm" onClick={() => deleteMut.mutate(d.rolId)}><Trash2 className="w-4 h-4 text-red-500"/></Button> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">Roles del Sistema</h1><p className="text-sm text-gray-500">Gestión de niveles de acceso.</p></div>
        <div className="bg-slate-100 p-2 rounded-full"><Shield className="h-6 w-6 text-slate-600" /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader><CardTitle>Nuevo Rol</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((d: any) => createMut.mutate(d))} className="space-y-4">
              <Input label="Nombre del Rol" placeholder="ADMINISTRADOR" {...register('nombre', {required: true})} />
              <Input label="Descripción" {...register('descripcion', {required: true})} />
              <Button type="submit" className="w-full" isLoading={createMut.isPending}><Plus className="w-4 h-4 mr-2"/> Registrar Rol</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <DataTable columns={columns} data={roles} isLoading={isLoading} emptyMessage="No hay roles." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
