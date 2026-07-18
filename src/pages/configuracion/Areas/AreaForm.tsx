import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { areaService } from '../../../services/area.service';
import type { Area } from '../../../types/area';
import { alerts } from '../../../utils/alerts';

const areaSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

type AreaFormData = z.infer<typeof areaSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  area: Area | null;
}

export default function AreaForm({ isOpen, onClose, area }: Props) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AreaFormData>({
    resolver: zodResolver(areaSchema),
  });

  useEffect(() => {
    if (area) {
      reset({
        nombre: area.nombre,
      });
    } else {
      reset({
        nombre: '',
      });
    }
  }, [area, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: AreaFormData) => 
      area ? areaService.update(area.areaId, data) : areaService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] });
      alerts.success(area ? 'Área actualizada exitosamente' : 'Área registrada exitosamente');
      onClose();
    },
    onError: (error: any) => {
      alerts.error(error.response?.data?.message || 'Error al guardar el área');
    }
  });

  const onSubmit = (data: AreaFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={area ? 'Editar Área' : 'Nueva Área'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: '24px' }}>
        <Input 
          label="Nombre del Área" 
          placeholder="Ej: Logística, Administración..."
          {...register('nombre')} 
          error={errors.nombre?.message} 
        />
        
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {area ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
