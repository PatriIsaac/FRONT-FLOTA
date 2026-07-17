import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { vehiculoService } from '../../../services/vehiculo.service';
import { categoriaVehiculoService } from '../../../services/categoriaVehiculo.service';
import type { Vehiculo } from '../../../types/vehiculo';
import { ESTADOS_VEHICULO } from '../../../types/vehiculo';
import { alerts } from '../../../utils/alerts';

const vehiculoSchema = z.object({
  codigoPatrimonio: z.string().min(1, 'El código patrimonial es requerido'),
  placa: z.string().min(6, 'Placa inválida'),
  categoriaVehiculoId: z.coerce.number().min(1, 'Categoría requerida'),
  valorNuevo: z.coerce.number().min(0, 'Valor inválido'),
  valorResidual: z.coerce.number().min(0, 'Valor inválido'),
  vidaUtilAnios: z.coerce.number().min(1, 'Vida útil inválida'),
  estado: z.enum(ESTADOS_VEHICULO),
});

type VehiculoFormData = z.infer<typeof vehiculoSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  vehiculo: Vehiculo | null;
}

export default function VehiculoForm({ isOpen, onClose, vehiculo }: Props) {
  const queryClient = useQueryClient();
  const { data: categorias = [] } = useQuery({ queryKey: ['categoriasVehiculo'], queryFn: categoriaVehiculoService.getAll });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<VehiculoFormData>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: {
      estado: 'Operativo',
      categoriaVehiculoId: 0,
    }
  });

  useEffect(() => {
    if (vehiculo) {
      reset(vehiculo);
    } else {
      reset({
        codigoPatrimonio: '',
        placa: '',
        categoriaVehiculoId: 0,
        valorNuevo: 0,
        valorResidual: 0,
        vidaUtilAnios: 10,
        estado: 'Operativo'
      });
    }
  }, [vehiculo, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: VehiculoFormData) =>
      vehiculo ? vehiculoService.update(vehiculo.vehiculoId, data) : vehiculoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
      alerts.success(vehiculo ? 'Vehículo actualizado' : 'Vehículo registrado');
      onClose();
    },
    onError: () => {
      alerts.error('Error al guardar el vehículo');
    }
  });

  const onSubmit = (data: VehiculoFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Código Patrimonial"
            {...register('codigoPatrimonio')}
            error={errors.codigoPatrimonio?.message}
          />
          <Input
            label="Placa"
            {...register('placa')}
            error={errors.placa?.message}
            className="uppercase"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Select
            label="Categoría"
            {...register('categoriaVehiculoId')}
            error={errors.categoriaVehiculoId?.message}
            options={[
              { value: 0, label: 'Seleccione una categoría...' },
              ...categorias.map(c => ({ value: c.categoriaVehiculoId, label: c.nombre })),
            ]}
          />
          <Input
            label="Vida Útil (Años)"
            type="number"
            {...register('vidaUtilAnios')}
            error={errors.vidaUtilAnios?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Valor Nuevo ($)"
            type="number"
            step="0.01"
            {...register('valorNuevo')}
            error={errors.valorNuevo?.message}
          />
          <Input
            label="Valor Residual ($)"
            type="number"
            step="0.01"
            {...register('valorResidual')}
            error={errors.valorResidual?.message}
          />
        </div>

        <Select
          label="Estado"
          {...register('estado')}
          error={errors.estado?.message}
          options={ESTADOS_VEHICULO.map(e => ({ value: e, label: e }))}
        />

        <div className="flex justify-end gap-4 pt-6">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {vehiculo ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
