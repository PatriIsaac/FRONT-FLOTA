import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

export const alerts = {
  success: (message: string) => {
    toast.success(message);
  },
  
  error: (message: string) => {
    toast.error(message);
  },

  confirm: async (title: string, text: string) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5', // indigo-600
      cancelButtonColor: '#ef4444', // red-500
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
  },
  
  delete: async (itemName: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás ${itemName}. Esta acción no se puede deshacer.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#6b7280', 
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    return result.isConfirmed;
  }
};
