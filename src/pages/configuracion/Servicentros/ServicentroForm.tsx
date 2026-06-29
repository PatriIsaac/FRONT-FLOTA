import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { servicentroService } from '../../../services/servicentro.service';
import type { Servicentro } from '../../../types/servicentro';
import { alerts } from '../../../utils/alerts';

const servicentroSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  direccion: z.string().min(5, 'La dirección es obligatoria'),
  distrito: z.string().min(2, 'El distrito es obligatorio'),
  contacto: z.string().min(3, 'El contacto es obligatorio'),
});

type ServicentroFormData = z.infer<typeof servicentroSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  servicentro: Servicentro | null;
}

export default function ServicentroForm({ isOpen, onClose, servicentro }: Props) {
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServicentroFormData>({
    resolver: zodResolver(servicentroSchema),
  });

  useEffect(() => {
    if (servicentro) {
      reset({
        nombre: servicentro.nombre,
        direccion: servicentro.direccion,
        distrito: servicentro.distrito,
        contacto: servicentro.contacto,
      });
    } else {
      reset({
        nombre: '',
        direccion: '',
        distrito: '',
        contacto: '',
      });
    }
  }, [servicentro, reset, isOpen]);

  const mutation = useMutation({
    mutationFn: (data: ServicentroFormData) => 
      servicentro ? servicentroService.update(servicentro.id, data) : servicentroService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicentros'] });
      alerts.success(servicentro ? 'Servicentro actualizado' : 'Servicentro registrado');
      onClose();
    },
    onError: (error: any) => {
      alerts.error(error.message || 'Error al guardar el servicentro');
    }
  });

  const onSubmit = (data: ServicentroFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={servicentro ? 'Editar Servicentro' : 'Nuevo Servicentro'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input 
          label="Nombre del Servicentro" 
          placeholder="Ej: Grifo Repsol"
          {...register('nombre')} 
          error={errors.nombre?.message} 
        />
        
        <Input 
          label="Dirección" 
          placeholder="Av. Javier Prado 123"
          {...register('direccion')} 
          error={errors.direccion?.message} 
        />

        <Input 
          label="Distrito / Ciudad" 
          placeholder="San Isidro"
          {...register('distrito')} 
          error={errors.distrito?.message} 
        />

        <Input 
          label="Contacto / Teléfono" 
          placeholder="Pedro Ruiz - 987654321"
          {...register('contacto')} 
          error={errors.contacto?.message} 
        />
        
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {servicentro ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
