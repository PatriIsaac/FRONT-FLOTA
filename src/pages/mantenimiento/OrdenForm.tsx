import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { mantenimientoService } from '../../services/mantenimiento.service';
import type { OrdenServicio } from '../../types/mantenimiento';
import { alerts } from '../../utils/alerts';

const ordenSchema = z.object({
  numero: z.string().min(1, 'Número requerido'),
  vehiculoId: z.coerce.number().min(1, 'Vehículo requerido'),
  tipoId: z.coerce.number().min(1, 'Tipo requerido'),
  taller: z.string().min(1, 'Taller requerido'),
  fechaEntrada: z.string().min(1, 'Fecha requerida'),
  fechaSalida: z.string().optional(),
  kilometraje: z.coerce.number().min(0, 'Kilometraje requerido'),
});

type OrdenFormData = z.infer<typeof ordenSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orden: OrdenServicio | null;
}

export default function OrdenForm({ isOpen, onClose, orden }: Props) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrdenFormData>({
    resolver: zodResolver(ordenSchema),
  });

  useEffect(() => {
    if (orden) {
      reset({
        numero: orden.numero,
        vehiculoId: orden.vehiculoId,
        tipoId: orden.tipoId,
        taller: orden.taller,
        fechaEntrada: orden.fechaEntrada,
        fechaSalida: orden.fechaSalida || '',
        kilometraje: orden.kilometraje,
      });
    } else {
      reset({
        numero: '',
        vehiculoId: 1,
        tipoId: 1,
        taller: 'Taller Interno',
        fechaEntrada: new Date().toISOString().split('T')[0],
        fechaSalida: '',
        kilometraje: 0,
      });
    }
  }, [orden, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: OrdenFormData) => 
      orden ? mantenimientoService.update(orden.ordenId, data) : mantenimientoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mantenimientos'] });
      alerts.success(orden ? 'Orden actualizada' : 'Orden registrada');
      onClose();
    },
    onError: () => {
      alerts.error('Error al guardar la orden');
    }
  });

  const onSubmit = (data: OrdenFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={orden ? 'Editar Orden' : 'Nueva Orden'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Input label="Número" {...register('numero')} error={errors.numero?.message} />
          <Input label="Taller" {...register('taller')} error={errors.taller?.message} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input label="ID Vehículo" type="number" {...register('vehiculoId')} error={errors.vehiculoId?.message} />
          <Input label="ID Tipo" type="number" {...register('tipoId')} error={errors.tipoId?.message} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input label="Fecha Entrada" type="date" {...register('fechaEntrada')} error={errors.fechaEntrada?.message} />
          <Input label="Fecha Salida" type="date" {...register('fechaSalida')} error={errors.fechaSalida?.message} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Input label="Kilometraje" type="number" {...register('kilometraje')} error={errors.kilometraje?.message} />
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {orden ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
