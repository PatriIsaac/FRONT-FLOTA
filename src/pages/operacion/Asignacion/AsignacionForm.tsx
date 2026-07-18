import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { asignacionService } from '../../../services/asignacion.service';
import { vehiculoService } from '../../../services/vehiculo.service';
import { areaService } from '../../../services/area.service';
import { conductorService } from '../../../services/conductor.service';
import type { Asignacion } from '../../../types/asignacion';
import { alerts } from '../../../utils/alerts';

const asignacionSchema = z.object({
  vehiculoId: z.coerce.number().min(1, 'Seleccione un vehículo'),
  areaId: z.coerce.number().min(1, 'Seleccione un área'),
  conductorId: z.coerce.number().min(1, 'Seleccione un conductor'),
  fechaInicio: z.string().min(1, 'La fecha de inicio es requerida'),
  fechaFin: z.string().nullable().optional(),
});

type AsignacionFormData = z.infer<typeof asignacionSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  asignacion: Asignacion | null;
}

export default function AsignacionForm({ isOpen, onClose, asignacion }: Props) {
  const queryClient = useQueryClient();
  
  const { data: vehiculos = [] } = useQuery({ queryKey: ['vehiculos'], queryFn: vehiculoService.getAll });
  const { data: areas = [] } = useQuery({ queryKey: ['areas'], queryFn: areaService.getAll });
  const { data: conductores = [] } = useQuery({ queryKey: ['conductores'], queryFn: conductorService.getAll });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AsignacionFormData>({
    resolver: zodResolver(asignacionSchema),
  });

  useEffect(() => {
    if (asignacion) {
      reset({
        vehiculoId: asignacion.vehiculoId,
        areaId: asignacion.areaId,
        conductorId: asignacion.conductorId ?? undefined,
        fechaInicio: asignacion.fechaInicio ? new Date(asignacion.fechaInicio).toISOString().split('T')[0] : '',
        fechaFin: asignacion.fechaFin ? new Date(asignacion.fechaFin).toISOString().split('T')[0] : '',
      });
    } else {
      reset({
        vehiculoId: 0,
        areaId: 0,
        conductorId: 0,
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: '',
      });
    }
  }, [asignacion, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: AsignacionFormData) => {
      // transform empty string to null for fechaFin
      const payload = {
        ...data,
        fechaFin: data.fechaFin || null,
        fechaInicio: new Date(data.fechaInicio).toISOString()
      };
      if (payload.fechaFin) payload.fechaFin = new Date(payload.fechaFin).toISOString();

      return asignacion ? asignacionService.update(asignacion.asignacionId, payload) : asignacionService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaciones'] });
      alerts.success(asignacion ? 'Asignación actualizada' : 'Asignación registrada');
      onClose();
    },
    onError: (error: any) => {
      alerts.error(error.response?.data?.message || 'Error al guardar la asignación');
    }
  });

  const onSubmit = (data: AsignacionFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={asignacion ? 'Editar Asignación' : 'Nueva Asignación'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: '24px' }}>
        <Select 
          label="Vehículo" 
          {...register('vehiculoId')} 
          error={errors.vehiculoId?.message}
          options={[
            { value: 0, label: 'Seleccione un vehículo...' },
            ...vehiculos.map(v => ({ value: v.vehiculoId, label: `${v.placa} - ${v.codigoPatrimonio}` }))
          ]}
        />
        
        <Select 
          label="Área" 
          {...register('areaId')} 
          error={errors.areaId?.message}
          options={[
            { value: 0, label: 'Seleccione un área...' },
            ...areas.map(a => ({ value: a.areaId, label: a.nombre }))
          ]}
        />

        <Select 
          label="Conductor Asignado" 
          {...register('conductorId')} 
          error={errors.conductorId?.message}
          options={[
            { value: 0, label: 'Seleccione un conductor...' },
            ...conductores.map(c => ({ value: c.conductorId, label: c.nombre }))
          ]}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Fecha Inicio" 
            type="date"
            {...register('fechaInicio')} 
            error={errors.fechaInicio?.message} 
          />
          <Input 
            label="Fecha Fin (Opcional)" 
            type="date"
            {...register('fechaFin')} 
            error={errors.fechaFin?.message} 
          />
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {asignacion ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
