import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { usuarioService } from '../../../services/usuario.service';
import type { Usuario } from '../../../types/usuario';
import { alerts } from '../../../utils/alerts';

const usuarioSchema = z
  .object({
    nombres: z.string().min(1, 'El nombre es requerido'),
    apellidos: z.string().min(1, 'El apellido es requerido'),
    email: z.string().email('Email inválido'),
    password: z.string().optional(),
    rolId: z.coerce.number().min(1, 'Seleccione un rol'),
  })
  .refine((d) => !d.password || d.password.length >= 6, {
    message: 'Mínimo 6 caracteres',
    path: ['password'],
  });

type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
}

export default function UsuarioForm({ isOpen, onClose, usuario }: Props) {
  const queryClient = useQueryClient();
  const { data: roles = [] } = useQuery({ queryKey: ['roles'], queryFn: usuarioService.getAllRoles });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
  });

  useEffect(() => {
    if (usuario) {
      reset({
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rolId: usuario.rolId,
        password: '',
      });
    } else {
      reset({
        nombres: '',
        apellidos: '',
        email: '',
        rolId: 0,
        password: '',
      });
    }
  }, [usuario, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: UsuarioFormData) =>
      usuario ? usuarioService.updateUsuario(usuario.usuarioId, data) : usuarioService.createUsuario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      alerts.success(usuario ? 'Usuario actualizado' : 'Usuario registrado');
      onClose();
    },
    onError: (error: any) => {
      alerts.error(error.response?.data?.error || 'Error al guardar el usuario');
    }
  });

  const onSubmit = (data: UsuarioFormData) => {
    if (!usuario && !data.password) {
      alerts.error('La contraseña es obligatoria para nuevos usuarios');
      return;
    }
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={usuario ? 'Editar Usuario' : 'Nuevo Usuario'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Input label="Nombres" {...register('nombres')} error={errors.nombres?.message} />
          <Input label="Apellidos" {...register('apellidos')} error={errors.apellidos?.message} />
        </div>
        <Input label="Correo Electrónico" type="email" {...register('email')} error={errors.email?.message} />
        <Input
          label={usuario ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'}
          type="password"
          {...register('password')}
          error={errors.password?.message}
        />
        <Select
          label="Rol del Sistema"
          {...register('rolId')}
          error={errors.rolId?.message}
          options={[
            { value: 0, label: 'Seleccione un rol...' },
            ...roles.map((r: any) => ({ value: r.rolId, label: r.nombre })),
          ]}
        />

        <div className="flex justify-end gap-4 pt-6">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {usuario ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
