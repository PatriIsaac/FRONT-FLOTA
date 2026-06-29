import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Users, Plus, Trash2 } from 'lucide-react';
import { usuarioService } from '../../../services/usuario.service';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { alerts } from '../../../utils/alerts';

export default function UsuariosList() {
  const queryClient = useQueryClient();
  const { data: usuarios = [], isLoading } = useQuery({ queryKey: ['usuarios'], queryFn: usuarioService.getAllUsuarios });
  const { data: roles = [] } = useQuery({ queryKey: ['roles'], queryFn: usuarioService.getAllRoles });
  const { register, handleSubmit, reset } = useForm();

  const createMut = useMutation({
    mutationFn: usuarioService.createUsuario,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['usuarios']}); alerts.success('Usuario registrado'); reset(); }
  });
  
  const deleteMut = useMutation({
    mutationFn: usuarioService.deleteUsuario,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['usuarios']}); alerts.success('Usuario eliminado'); }
  });

  const columns = [
    { key: 'nombres', header: 'Nombre', render: (d: any) => `${d.nombres} ${d.apellidos}` },
    { key: 'email', header: 'Email' },
    { key: 'rol', header: 'Rol', render: (d: any) => d.rol?.nombre },
    { key: 'estado', header: 'Estado', render: (d: any) => <span className={`px-2 py-1 rounded text-xs font-bold ${d.estado ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{d.estado ? 'Activo' : 'Inactivo'}</span> },
    { key: 'acciones', header: 'Acciones', render: (d: any) => <Button variant="ghost" size="sm" onClick={() => deleteMut.mutate(d.usuarioId)}><Trash2 className="w-4 h-4 text-red-500"/></Button> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">Usuarios del Sistema</h1><p className="text-sm text-gray-500">Gestión de accesos y credenciales.</p></div>
        <div className="bg-slate-100 p-2 rounded-full"><Users className="h-6 w-6 text-slate-600" /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader><CardTitle>Nuevo Usuario</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((d: any) => createMut.mutate({...d, rolId: Number(d.rolId)}))} className="space-y-4">
              <Input label="Nombres" {...register('nombres', {required: true})} />
              <Input label="Apellidos" {...register('apellidos', {required: true})} />
              <Input label="Email" type="email" {...register('email', {required: true})} />
              <Input label="Contraseña" type="password" {...register('password', {required: true})} />
              <Select label="Rol" {...register('rolId', {required: true})} options={roles.map((r:any) => ({value:r.rolId, label:r.nombre}))} />
              <Button type="submit" className="w-full" isLoading={createMut.isPending}><Plus className="w-4 h-4 mr-2"/> Registrar Usuario</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <DataTable columns={columns} data={usuarios} isLoading={isLoading} emptyMessage="No hay usuarios." />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
