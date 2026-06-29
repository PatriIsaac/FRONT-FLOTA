import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { usuarioService } from '../../../services/usuario.service';
import type { Usuario } from '../../../types/usuario';
import { alerts } from '../../../utils/alerts';

const usuarioSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().optional(),
  rol: z.enum([
    'Administrador',
    'Gerencia',
    'Analista de Costos',
    'Jefe de Mantenimiento',
    'Encargado de Garaje',
    'Conductor'
  ]),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
}

export default function UsuarioForm({ isOpen, onClose, usuario }: Props) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
  });

  useEffect(() => {
    if (usuario) {
      reset({
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol as any,
        password: ''
      });
    } else {
      reset({
        nombre: '',
        email: '',
        rol: 'Conductor',
        password: ''
      });
    }
  }, [usuario, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: UsuarioFormData) => 
      usuario ? usuarioService.update(usuario.id, data) : usuarioService.create(data),
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
        <div className="grid grid-cols-1 gap-6">
          <Input label="Nombre Completo" {...register('nombre')} error={errors.nombre?.message} />
          <Input label="Correo Electrónico" type="email" {...register('email')} error={errors.email?.message} />
          <Input 
            label={usuario ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña'} 
            type="password" 
            {...register('password')} 
            error={errors.password?.message} 
          />
          <Select 
            label="Rol del Sistema" 
            {...register('rol')} 
            error={errors.rol?.message}
            options={[
              { value: 'Administrador', label: 'Administrador (Acceso Total)' },
              { value: 'Gerencia', label: 'Gerencia' },
              { value: 'Analista de Costos', label: 'Analista de Costos' },
              { value: 'Jefe de Mantenimiento', label: 'Jefe de Mantenimiento' },
              { value: 'Encargado de Garaje', label: 'Encargado de Garaje' },
              { value: 'Conductor', label: 'Conductor' },
            ]}
          />
        </div>

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
