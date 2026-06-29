import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { tallerService } from '../../../services/taller.service';
import type { Taller } from '../../../types/taller';
import { alerts } from '../../../utils/alerts';

const tallerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  tipo: z.enum(['Propio', 'Tercero']),
  direccion: z.string().min(5, 'La dirección es obligatoria'),
  contacto: z.string().min(3, 'El contacto es obligatorio'),
});

type TallerFormData = z.infer<typeof tallerSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  taller: Taller | null;
}

export default function TallerForm({ isOpen, onClose, taller }: Props) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TallerFormData>({
    resolver: zodResolver(tallerSchema),
  });

  useEffect(() => {
    if (taller) {
      reset({
        nombre: taller.nombre,
        tipo: taller.tipo,
        direccion: taller.direccion,
        contacto: taller.contacto,
      });
    } else {
      reset({
        nombre: '',
        tipo: 'Tercero',
        direccion: '',
        contacto: '',
      });
    }
  }, [taller, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: TallerFormData) => 
      taller ? tallerService.update(taller.id, data) : tallerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talleres'] });
      alerts.success(taller ? 'Taller actualizado exitosamente' : 'Taller registrado exitosamente');
      onClose();
    },
    onError: (error: any) => {
      alerts.error(error.message || 'Error al guardar el taller');
    }
  });

  const onSubmit = (data: TallerFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={taller ? 'Editar Taller' : 'Nuevo Taller'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input 
          label="Nombre del Taller" 
          placeholder="Ej: Automotriz del Centro"
          {...register('nombre')} 
          error={errors.nombre?.message} 
        />
        
        <Select 
          label="Tipo de Taller" 
          {...register('tipo')} 
          error={errors.tipo?.message}
          options={[
            { value: 'Propio', label: 'Propio (Interno)' },
            { value: 'Tercero', label: 'Tercero (Externo)' },
          ]}
        />

        <Input 
          label="Dirección" 
          placeholder="Av. Principal 456"
          {...register('direccion')} 
          error={errors.direccion?.message} 
        />

        <Input 
          label="Contacto / Teléfono" 
          placeholder="Juan Perez - 987654321"
          {...register('contacto')} 
          error={errors.contacto?.message} 
        />
        
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {taller ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
