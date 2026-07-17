import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { tallerService } from '../../../services/taller.service';
import type { Taller } from '../../../types/taller';
import { alerts } from '../../../utils/alerts';

const tallerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  ruc: z.string().min(1, 'El RUC es obligatorio'),
  direccion: z.string().min(5, 'La dirección es obligatoria'),
  telefono: z.string().min(1, 'El teléfono es obligatorio'),
});

type TallerFormData = z.infer<typeof tallerSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  taller: Taller | null;
}

export default function TallerForm({ isOpen, onClose, taller }: Props) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TallerFormData>({
    resolver: zodResolver(tallerSchema),
  });

  useEffect(() => {
    if (taller) {
      reset({
        nombre: taller.nombre,
        ruc: taller.ruc,
        direccion: taller.direccion,
        telefono: taller.telefono,
      });
    } else {
      reset({
        nombre: '',
        ruc: '',
        direccion: '',
        telefono: '',
      });
    }
  }, [taller, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: TallerFormData) =>
      taller ? tallerService.update(taller.tallerId, data) : tallerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talleres'] });
      alerts.success(taller ? 'Taller actualizado exitosamente' : 'Taller registrado exitosamente');
      onClose();
    },
    onError: (error: any) => {
      alerts.error(error.response?.data?.error || 'Error al guardar el taller');
    }
  });

  const onSubmit = (data: TallerFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={taller ? 'Editar Taller' : 'Nuevo Taller'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Razón Social"
          placeholder="Ej: Automotriz del Centro"
          {...register('nombre')}
          error={errors.nombre?.message}
        />

        <Input
          label="RUC"
          placeholder="20123456789"
          {...register('ruc')}
          error={errors.ruc?.message}
        />

        <Input
          label="Dirección"
          placeholder="Av. Principal 456"
          {...register('direccion')}
          error={errors.direccion?.message}
        />

        <Input
          label="Teléfono"
          placeholder="987654321"
          {...register('telefono')}
          error={errors.telefono?.message}
        />

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {taller ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
