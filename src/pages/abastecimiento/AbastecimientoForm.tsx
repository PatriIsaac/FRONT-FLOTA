import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { abastecimientoService } from '../../services/abastecimiento.service';
import { vehiculoService } from '../../services/vehiculo.service';
import { servicentroService } from '../../services/servicentro.service';
import type { Abastecimiento } from '../../types/abastecimiento';
import { alerts } from '../../utils/alerts';

const abastecimientoSchema = z.object({
  numeroOrden: z.string().min(1, 'La orden es requerida'),
  vehiculoId: z.coerce.number().min(1, 'Seleccione un vehículo'),
  servicentroId: z.coerce.number().min(1, 'Seleccione un servicentro'),
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
  const { data: vehiculos = [] } = useQuery({ queryKey: ['vehiculos'], queryFn: vehiculoService.getAll });
  const { data: servicentros = [] } = useQuery({ queryKey: ['servicentros'], queryFn: servicentroService.getAll });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AbastecimientoFormData>({
    resolver: zodResolver(abastecimientoSchema),
  });

  useEffect(() => {
    if (abastecimiento) {
      reset({
        numeroOrden: abastecimiento.numeroOrden,
        vehiculoId: abastecimiento.vehiculoId,
        servicentroId: abastecimiento.servicentroId,
        fecha: abastecimiento.fecha,
        tipoCombustible: abastecimiento.tipoCombustible,
        galones: abastecimiento.galones,
        costo: abastecimiento.costo,
        kmVelocimetro: abastecimiento.kmVelocimetro,
      });
    } else {
      reset({
        numeroOrden: '',
        vehiculoId: 0,
        servicentroId: 0,
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
          <Select
            label="Vehículo"
            {...register('vehiculoId')}
            error={errors.vehiculoId?.message}
            options={[
              { value: 0, label: 'Seleccione un vehículo...' },
              ...vehiculos.map(v => ({ value: v.vehiculoId, label: `${v.placa} - ${v.codigoPatrimonio}` })),
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Select
            label="Servicentro"
            {...register('servicentroId')}
            error={errors.servicentroId?.message}
            options={[
              { value: 0, label: 'Seleccione un servicentro...' },
              ...servicentros.map(s => ({ value: s.servicentroId, label: s.nombre })),
            ]}
          />
          <Input label="Fecha" type="date" {...register('fecha')} error={errors.fecha?.message} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Select
            label="Tipo Combustible"
            {...register('tipoCombustible')}
            error={errors.tipoCombustible?.message}
            options={[
              { value: 'DIESEL', label: 'DIESEL' },
              { value: 'GASOLINA', label: 'GASOLINA' },
            ]}
          />
          <Input label="Km Velocímetro" type="number" {...register('kmVelocimetro')} error={errors.kmVelocimetro?.message} />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input label="Galones" type="number" step="0.01" {...register('galones')} error={errors.galones?.message} />
          <Input label="Costo ($)" type="number" step="0.01" {...register('costo')} error={errors.costo?.message} />
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
