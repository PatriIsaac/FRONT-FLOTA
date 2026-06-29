import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { conductorService } from '../../../services/conductor.service';
import type { Conductor } from '../../../types/conductor';
import { alerts } from '../../../utils/alerts';

const conductorSchema = z.object({
  documento: z.string().min(1, 'El documento es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  osActivo: z.boolean(),
});

type ConductorFormData = z.infer<typeof conductorSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  conductor: Conductor | null;
}

export default function ConductorForm({ isOpen, onClose, conductor }: Props) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ConductorFormData>({
    resolver: zodResolver(conductorSchema),
    defaultValues: {
      osActivo: true
    }
  });

  useEffect(() => {
    if (conductor) {
      reset({
        documento: conductor.documento,
        nombre: conductor.nombre,
        osActivo: conductor.osActivo
      });
    } else {
      reset({
        documento: '',
        nombre: '',
        osActivo: true
      });
    }
  }, [conductor, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: ConductorFormData) => 
      conductor ? conductorService.update(conductor.conductorId, data) : conductorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conductores'] });
      alerts.success(conductor ? 'Conductor actualizado' : 'Conductor registrado');
      onClose();
    },
    onError: () => {
      alerts.error('Error al guardar el conductor');
    }
  });

  const onSubmit = (data: ConductorFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={conductor ? 'Editar Conductor' : 'Nuevo Conductor'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Input label="Documento" {...register('documento')} error={errors.documento?.message} />
          <Input label="Nombre" {...register('nombre')} error={errors.nombre?.message} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input type="checkbox" {...register('osActivo')} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
            Activo en el sistema
          </label>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {conductor ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
