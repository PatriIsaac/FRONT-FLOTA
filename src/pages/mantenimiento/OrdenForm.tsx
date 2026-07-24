import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { mantenimientoService } from '../../services/mantenimiento.service';
import { vehiculoService } from '../../services/vehiculo.service';
import { tipoMantenimientoService } from '../../services/tipoMantenimiento.service';
import { tallerService } from '../../services/taller.service';
import type { OrdenServicio } from '../../types/mantenimiento';
import { alerts } from '../../utils/alerts';

const ordenSchema = z.object({
  numero: z.string().min(1, 'Número requerido'),
  vehiculoId: z.coerce.number().min(1, 'Seleccione un vehículo'),
  tipoId: z.coerce.number().min(1, 'Seleccione un tipo de mantenimiento'),
  tallerId: z.coerce.number().optional(),
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
  const { data: vehiculos = [] } = useQuery({ queryKey: ['vehiculos'], queryFn: vehiculoService.getAll });
  const { data: tipos = [] } = useQuery({ queryKey: ['tiposMantenimiento'], queryFn: tipoMantenimientoService.getAll });
  const { data: talleres = [] } = useQuery({ queryKey: ['talleres'], queryFn: tallerService.getAll });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrdenFormData>({
    resolver: zodResolver(ordenSchema) as any,
  });

  useEffect(() => {
    if (orden) {
      reset({
        numero: orden.numero,
        vehiculoId: orden.vehiculoId,
        tipoId: orden.tipoId,
        tallerId: orden.tallerId,
        fechaEntrada: orden.fechaEntrada,
        fechaSalida: orden.fechaSalida || '',
        kilometraje: orden.kilometraje,
      });
    } else {
      const defaultTallerId = talleres.length > 0 ? talleres[0].tallerId : 1;
      reset({
        numero: '',
        vehiculoId: 0,
        tipoId: 0,
        tallerId: defaultTallerId,
        fechaEntrada: new Date().toISOString().split('T')[0],
        fechaSalida: '',
        kilometraje: 0,
      });
    }
  }, [orden, reset, isOpen, talleres]);

  const mutation = useMutation({
    mutationFn: (data: OrdenFormData) =>
      orden ? mantenimientoService.update(orden.ordenId, data as any) : mantenimientoService.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mantenimientos'] });
      alerts.success(orden ? 'Orden actualizada' : 'Orden registrada');
      onClose();
    },
    onError: (error: any) => {
      alerts.error(error.response?.data?.message || 'Error al guardar la orden');
    }
  });

  const onSubmit = (data: OrdenFormData) => {
    const finalData = { ...data };
    if (!finalData.tallerId) {
      finalData.tallerId = talleres.length > 0 ? talleres[0].tallerId : 1;
    }
    if (finalData.fechaSalida === '') {
      delete finalData.fechaSalida;
    }
    mutation.mutate(finalData as any);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={orden ? 'Editar Orden' : 'Nueva Orden'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: '24px' }}>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Número" {...register('numero')} error={errors.numero?.message} />
          <Select
            label="Taller"
            disabled
            {...register('tallerId')}
            error={errors.tallerId?.message}
            options={talleres.map(t => ({ value: t.tallerId, label: t.nombre }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Vehículo"
            {...register('vehiculoId')}
            error={errors.vehiculoId?.message}
            options={[
              { value: 0, label: 'Seleccione un vehículo...' },
              ...vehiculos.map(v => ({ value: v.vehiculoId, label: `${v.placa} - ${v.codigoPatrimonio}` })),
            ]}
          />
          <Select
            label="Tipo de Mantenimiento"
            {...register('tipoId')}
            error={errors.tipoId?.message}
            options={[
              { value: 0, label: 'Seleccione un tipo...' },
              ...tipos.map(t => ({ value: t.tipoId, label: t.descripcion })),
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Fecha Entrada" type="date" {...register('fechaEntrada')} error={errors.fechaEntrada?.message} />
          <Input label="Fecha Salida" type="date" {...register('fechaSalida')} error={errors.fechaSalida?.message} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Input label="Kilometraje" type="number" {...register('kilometraje')} error={errors.kilometraje?.message} />
        </div>

        <div className="flex justify-end gap-4 pt-6 mt-2 border-t border-gray-100">
          <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {orden ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
