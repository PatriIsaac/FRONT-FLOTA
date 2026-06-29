import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { movimientoService } from '../../../services/movimiento.service';
import type { MovimientoDiario } from '../../../types/movimiento';
import { alerts } from '../../../utils/alerts';

const movimientoSchema = z.object({
  vehiculoId: z.coerce.number().min(1, 'Vehículo requerido'),
  conductorId: z.coerce.number().min(1, 'Conductor requerido'),
  fecha: z.string().min(1, 'Fecha requerida'),
  kmSalida: z.coerce.number().min(0, 'Requerido'),
  kmLlegada: z.coerce.number().min(0, 'Requerido'),
  horas: z.coerce.number().min(0, 'Requerido'),
  destino: z.string().min(1, 'Destino requerido'),
}).refine((d) => d.kmLlegada >= d.kmSalida, {
  message: 'Km Llegada no puede ser menor que Km Salida',
  path: ['kmLlegada'],
});

type MovimientoFormData = z.infer<typeof movimientoSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  movimiento: MovimientoDiario | null;
}

export default function MovimientoForm({ isOpen, onClose, movimiento }: Props) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MovimientoFormData>({
    resolver: zodResolver(movimientoSchema),
  });

  useEffect(() => {
    if (movimiento) {
      reset({
        vehiculoId: movimiento.vehiculoId,
        conductorId: movimiento.conductorId,
        fecha: movimiento.fecha,
        kmSalida: movimiento.kmSalida,
        kmLlegada: movimiento.kmLlegada,
        horas: movimiento.horas,
        destino: movimiento.destino,
      });
    } else {
      reset({
        vehiculoId: 1,
        conductorId: 1,
        fecha: new Date().toISOString().split('T')[0],
        kmSalida: 0,
        kmLlegada: 0,
        horas: 0,
        destino: '',
      });
    }
  }, [movimiento, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: MovimientoFormData) => 
      movimiento ? movimientoService.update(movimiento.movimientoId, data) : movimientoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movimientos'] });
      alerts.success(movimiento ? 'Movimiento actualizado' : 'Movimiento registrado');
      onClose();
    },
    onError: (err: any) => {
      alerts.error(err?.response?.data?.error ?? 'Error al guardar el movimiento');
    }
  });

  const onSubmit = (data: MovimientoFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={movimiento ? 'Editar Movimiento' : 'Nuevo Movimiento'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Input label="ID Vehículo" type="number" {...register('vehiculoId')} error={errors.vehiculoId?.message} />
          <Input label="ID Conductor" type="number" {...register('conductorId')} error={errors.conductorId?.message} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input label="Fecha" type="date" {...register('fecha')} error={errors.fecha?.message} />
          <Input label="Destino" {...register('destino')} error={errors.destino?.message} />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Input label="Km Salida" type="number" {...register('kmSalida')} error={errors.kmSalida?.message} />
          <Input label="Km Llegada" type="number" {...register('kmLlegada')} error={errors.kmLlegada?.message} />
          <Input label="Horas" type="number" {...register('horas')} error={errors.horas?.message} />
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {movimiento ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
