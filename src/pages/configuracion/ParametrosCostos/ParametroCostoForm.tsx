import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { costoService } from '../../../services/costo.service';
import { vehiculoService } from '../../../services/vehiculo.service';
import type { CostoFijoMensual } from '../../../types/costo';
import { alerts } from '../../../utils/alerts';

const costoSchema = z.object({
  vehiculoId: z.coerce.number().min(1, 'Seleccione un vehículo'),
  mesAnio: z.string().regex(/^\d{4}-\d{2}$/, 'Formato inválido (YYYY-MM)'),
  cfp: z.coerce.number().min(0, 'El CFP debe ser mayor o igual a 0'),
  cfv: z.coerce.number().min(0, 'El CFV debe ser mayor o igual a 0'),
});

type CostoFormData = z.infer<typeof costoSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  costo: CostoFijoMensual | null;
}

export default function ParametroCostoForm({ isOpen, onClose, costo }: Props) {
  const queryClient = useQueryClient();
  
  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CostoFormData>({
    resolver: zodResolver(costoSchema),
  });

  useEffect(() => {
    if (costo) {
      reset({
        vehiculoId: costo.vehiculoId,
        mesAnio: costo.mesAnio,
        cfp: costo.cfp,
        cfv: costo.cfv,
      });
    } else {
      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      reset({
        vehiculoId: 0,
        mesAnio: `${today.getFullYear()}-${month}`,
        cfp: 0,
        cfv: 0,
      });
    }
  }, [costo, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: CostoFormData) => 
      costo ? costoService.update(costo.cfmId, data) : costoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['costos'] });
      alerts.success(costo ? 'Parámetros actualizados' : 'Parámetros registrados');
      onClose();
    },
    onError: (error: any) => {
      alerts.error(error.response?.data?.message || 'Error al guardar');
    }
  });

  const onSubmit = (data: CostoFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={costo ? 'Editar Parámetro' : 'Registrar CFP/CFV'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: '24px' }}>
        <Select 
          label="Vehículo" 
          {...register('vehiculoId')} 
          error={errors.vehiculoId?.message}
          options={[
            { value: 0, label: 'Seleccione un vehículo...' },
            ...vehiculos.map(v => ({
              value: v.vehiculoId,
              label: `${v.placa} - ${v.codigoPatrimonio}`
            }))
          ]}
        />
        
        <Input 
          label="Mes y Año (YYYY-MM)" 
          type="month"
          {...register('mesAnio')} 
          error={errors.mesAnio?.message} 
        />

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Costo Fijo (CFP)" 
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('cfp')} 
            error={errors.cfp?.message} 
          />

          <Input 
            label="Costo Variable (CFV)" 
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('cfv')} 
            error={errors.cfv?.message} 
          />
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {costo ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
