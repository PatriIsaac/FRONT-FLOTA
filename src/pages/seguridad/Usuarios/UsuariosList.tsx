import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Users, Plus, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { usuarioService } from '../../../services/usuario.service';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { alerts } from '../../../utils/alerts';
import UsuarioForm from './UsuarioForm';
import type { Usuario } from '../../../types/usuario';

export default function UsuariosList() {
  const queryClient = useQueryClient();
  const { data: usuarios = [], isLoading } = useQuery({ queryKey: ['usuarios'], queryFn: usuarioService.getAllUsuarios });
  const { data: roles = [] } = useQuery({ queryKey: ['roles'], queryFn: usuarioService.getAllRoles });
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { nombres: '', apellidos: '', email: '', password: '', rolId: '' }
  });
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const createMut = useMutation({
    mutationFn: usuarioService.createUsuario,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['usuarios']}); alerts.success('Usuario registrado'); reset(); },
    onError: (error: any) => { alerts.error(error.response?.data?.error || 'Error al registrar usuario. Es posible que el correo ya exista.'); }
  });

  const deleteMut = useMutation({
    mutationFn: usuarioService.deleteUsuario,
    onSuccess: () => { queryClient.invalidateQueries({queryKey:['usuarios']}); alerts.success('Usuario eliminado permanentemente'); }
  });

  const toggleEstadoMut = useMutation({
    mutationFn: ({ id, estado }: { id: number, estado: boolean }) => usuarioService.updateUsuario(id, { estado }),
    onSuccess: (_, variables) => { 
      queryClient.invalidateQueries({queryKey:['usuarios']}); 
      alerts.success(variables.estado ? 'Usuario activado' : 'Usuario inactivado'); 
    },
    onError: (error: any) => { alerts.error(error.response?.data?.error || 'Error al cambiar el estado del usuario'); }
  });

  const handleInactivar = async (d: any) => {
    if (await alerts.confirm('¿Inactivar Usuario?', `¿Está seguro de inactivar a ${d.nombres}? No podrá operar hasta ser activado.`)) {
      toggleEstadoMut.mutate({ id: d.usuarioId, estado: false });
    }
  };

  const handleActivar = async (d: any) => {
    if (await alerts.confirm('¿Activar Usuario?', `¿Está seguro de reactivar a ${d.nombres}?`)) {
      toggleEstadoMut.mutate({ id: d.usuarioId, estado: true });
    }
  };

  const handleEliminar = async (d: any) => {
    if (await alerts.delete(`al usuario ${d.nombres}`)) {
      deleteMut.mutate(d.usuarioId);
    }
  };

  const columns = [
    { key: 'nombres', header: 'Nombre', render: (d: any) => `${d.nombres} ${d.apellidos}` },
    { key: 'email', header: 'Email' },
    { key: 'rol', header: 'Rol', render: (d: any) => d.Rol?.nombre },
    { key: 'estado', header: 'Estado', render: (d: any) => <span className={`px-2 py-1 rounded text-xs font-bold ${d.estado ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{d.estado ? 'Activo' : 'Inactivo'}</span> },
    {
      key: 'acciones', header: 'Acciones', render: (d: any) => (
        <div className="flex gap-2">
          {/* Botón Editar: deshabilitado si está inactivo */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setEditando(d); setModalAbierto(true); }} 
            title={d.estado ? "Editar" : "Active al usuario para poder editar"}
            disabled={!d.estado}
          >
            <Edit2 className={`w-4 h-4 ${d.estado ? 'text-indigo-600' : 'text-gray-400'}`} />
          </Button>
          
          {/* Botón de Cambio de Estado (Activar/Inactivar) */}
          {d.estado ? (
            <Button variant="ghost" size="sm" onClick={() => handleInactivar(d)} title="Inactivar">
              <XCircle className="w-4 h-4 text-orange-500" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => handleActivar(d)} title="Activar">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </Button>
          )}

          {/* Botón Eliminar Permanente */}
          <Button variant="ghost" size="sm" onClick={() => handleEliminar(d)} title="Eliminar Permanentemente">
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-gray-900">Usuarios del Sistema</h1><p className="text-sm text-gray-500">Gestión de accesos y credenciales.</p></div>
        <div className="bg-slate-100 p-2 rounded-full"><Users className="h-6 w-6 text-slate-600" /></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader><CardTitle>Nuevo Usuario</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((d: any) => createMut.mutate({...d, rolId: Number(d.rolId)}))} className="flex flex-col gap-5">
              <Input label="Nombres" {...register('nombres', {required: 'El campo Nombres no puede estar vacío'})} error={errors.nombres?.message as string} />
              <Input label="Apellidos" {...register('apellidos', {required: 'El campo Apellidos no puede estar vacío'})} error={errors.apellidos?.message as string} />
              <Input label="Email" type="email" {...register('email', {required: 'El campo Correo no puede estar vacío'})} error={errors.email?.message as string} />
              <Input label="Contraseña" type="password" {...register('password', {required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'La contraseña debe tener mínimo 6 caracteres' }})} error={errors.password?.message as string} />
              <Select label="Rol" {...register('rolId', {required: 'Debe seleccionar un rol del sistema'})} options={roles.map((r:any) => ({value:r.rolId, label:r.nombre}))} error={errors.rolId?.message as string} />
              <Button type="submit" className="w-full mt-2" isLoading={createMut.isPending}><Plus className="w-4 h-4 mr-2"/> Registrar Usuario</Button>
            </form>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent>
            <DataTable columns={columns} data={usuarios} isLoading={isLoading} emptyMessage="No hay usuarios." />
          </CardContent>
        </Card>
      </div>
      <UsuarioForm
        isOpen={modalAbierto}
        onClose={() => { setModalAbierto(false); setEditando(null); }}
        usuario={editando}
      />
    </div>
  );
}
