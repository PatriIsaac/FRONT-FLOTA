import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { abastecimientoService } from '../../services/abastecimiento.service';
import type { Abastecimiento } from '../../types/abastecimiento';
import { alerts } from '../../utils/alerts';

const abastecimientoSchema = z.object({
  numeroOrden: z.string().min(1, 'La orden es requerida'),
  vehiculoId: z.coerce.number().min(1, 'Vehículo requerido'),
  fecha: z.string().min(1, 'Fecha requerida'),
  tipoCombustible: z.string().min(1, 'Tipo requerido'),
  galones: z.coerce.number().min(0.1, 'Mínimo 0.1'),
  costo: z.coerce.number().min(0.1, 'Mínimo 0.1'),
  kmVelocimetro: z.coerce.number().min(0, 'Km requerido'),
});

type AbastecimientoFormData = z.infer<typeof abastecimientoSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  abastecimiento: Abastecimiento | null;
}

export default function AbastecimientoForm({ isOpen, onClose, abastecimiento }: Props) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AbastecimientoFormData>({
    resolver: zodResolver(abastecimientoSchema),
  });

  useEffect(() => {
    if (abastecimiento) {
      reset({
        numeroOrden: abastecimiento.numeroOrden,
        vehiculoId: abastecimiento.vehiculoId,
        fecha: abastecimiento.fecha,
        tipoCombustible: abastecimiento.tipoCombustible,
        galones: abastecimiento.galones,
        costo: abastecimiento.costo,
        kmVelocimetro: abastecimiento.kmVelocimetro,
      });
    } else {
      reset({
        numeroOrden: '',
        vehiculoId: 1,
        fecha: new Date().toISOString().split('T')[0],
        tipoCombustible: 'DIESEL',
        galones: 0,
        costo: 0,
        kmVelocimetro: 0,
      });
    }
  }, [abastecimiento, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: AbastecimientoFormData) => 
      abastecimiento ? abastecimientoService.update(abastecimiento.abastecimientoId, data) : abastecimientoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abastecimientos'] });
      alerts.success(abastecimiento ? 'Abastecimiento actualizado' : 'Abastecimiento registrado');
      onClose();
    },
    onError: () => {
      alerts.error('Error al guardar el abastecimiento');
    }
  });

  const onSubmit = (data: AbastecimientoFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={abastecimiento ? 'Editar Abastecimiento' : 'Nuevo Abastecimiento'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Input label="Número de Orden" {...register('numeroOrden')} error={errors.numeroOrden?.message} />
          <Input label="ID Vehículo" type="number" {...register('vehiculoId')} error={errors.vehiculoId?.message} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input label="Fecha" type="date" {...register('fecha')} error={errors.fecha?.message} />
          <Select 
            label="Tipo Combustible" 
            {...register('tipoCombustible')} 
            error={errors.tipoCombustible?.message}
            options={[
              { value: 'DIESEL', label: 'DIESEL' },
              { value: 'GASOLINA', label: 'GASOLINA' },
            ]}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Input label="Galones" type="number" step="0.01" {...register('galones')} error={errors.galones?.message} />
          <Input label="Costo ($)" type="number" step="0.01" {...register('costo')} error={errors.costo?.message} />
          <Input label="Km Velocímetro" type="number" {...register('kmVelocimetro')} error={errors.kmVelocimetro?.message} />
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {abastecimiento ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
