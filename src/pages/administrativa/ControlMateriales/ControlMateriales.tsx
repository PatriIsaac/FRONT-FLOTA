import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, CheckCircle, Trash2, Plus } from 'lucide-react';
import { administrativaService } from '../../../services/administrativa.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { useForm } from 'react-hook-form';

export default function ControlMateriales() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('solicitudes'); // 'solicitudes' | 'catalogo'

  const { data: solicitudes = [], isLoading: loadingSol } = useQuery({
    queryKey: ['solicitudes'],
    queryFn: administrativaService.getSolicitudes
  });

  const { data: materiales = [], isLoading: loadingMat } = useQuery({
    queryKey: ['materiales'],
    queryFn: administrativaService.getMateriales
  });

  const deleteSolicitud = useMutation({
    mutationFn: administrativaService.deleteSolicitud,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      alerts.success('Solicitud eliminada');
    }
  });

  const aprobarSolicitud = useMutation({
    mutationFn: (id: number) => administrativaService.updateEstadoSolicitud(id, 'APROBADA'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['solicitudes'] });
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
      alerts.success('Solicitud aprobada y stock descontado');
    }
  });

  const columnsSolicitudes = [
    { key: 'numero', header: 'N° Solicitud' },
    { key: 'fecha', header: 'Fecha', render: (d: any) => new Date(d.fecha).toLocaleDateString() },
    { key: 'orden', header: 'Orden', render: (d: any) => d.OrdenServicio?.numero || '-' },
    { key: 'detalles', header: 'Materiales Solicitados', render: (d: any) => (
      <div className="text-xs text-gray-600 max-w-xs truncate">
        {d.DetalleSolicitud?.map((det: any) => `${det.cantidad}x ${det.Material?.nombre}`).join(', ') || 'Sin detalles'}
      </div>
    )},
    { key: 'estado', header: 'Estado', render: (d: any) => (
      <span className={`px-2 py-1 rounded text-xs font-bold ${d.estado === 'PENDIENTE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
        {d.estado}
      </span>
    )},
    {
      key: 'acciones',
      header: 'Acciones',
      render: (d: any) => (
        <div className="flex gap-2">
          {d.estado === 'PENDIENTE' && (
            <Button variant="ghost" size="sm" onClick={() => {
              if (confirm('¿Aprobar solicitud? Esto descontará el stock.')) aprobarSolicitud.mutate(d.solicitudId);
            }} isLoading={aprobarSolicitud.isPending}>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => {
            if (confirm('¿Eliminar solicitud?')) deleteSolicitud.mutate(d.solicitudId);
          }}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  const addStockMaterial = useMutation({
    mutationFn: async ({ id, cantidad }: { id: number, cantidad: number }) => {
      const currentMaterial = materiales.find((m: any) => m.materialId === id);
      const newStock = (currentMaterial.stockActual || 0) + cantidad;
      return administrativaService.updateMaterial(id, { stockActual: newStock });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
      alerts.success('Stock actualizado');
    }
  });

  const deleteMaterial = useMutation({
    mutationFn: administrativaService.deleteMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiales'] });
      alerts.success('Material eliminado');
    }
  });

  const columnsMateriales = [
    { key: 'codigo', header: 'Código' },
    { key: 'nombre', header: 'Descripción' },
    { key: 'categoria', header: 'Categoría', render: (d: any) => d.categoria || 'General' },
    { key: 'stockActual', header: 'Stock Actual', render: (d: any) => <span className="font-bold">{d.stockActual || 0} {d.unidad}</span> },
    { key: 'costoUnitario', header: 'Costo Unit.', render: (d: any) => `US$ ${d.costoUnitario || '0.00'}` },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (d: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => {
            const qty = prompt(`¿Cuánto stock deseas añadir a ${d.codigo}?`);
            if (qty && !isNaN(Number(qty))) {
              addStockMaterial.mutate({ id: d.materialId, cantidad: Number(qty) });
            }
          }} title="Añadir Stock">
            <Plus className="h-4 w-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
            if (confirm('¿Eliminar este material del catálogo?')) deleteMaterial.mutate(d.materialId);
          }} title="Eliminar Material">
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  const FormNuevoMaterial = () => {
    const { register, handleSubmit, reset } = useForm();
    const createMat = useMutation({
      mutationFn: administrativaService.createMaterial,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['materiales'] });
        alerts.success('Material agregado');
        reset();
      },
      onError: (err: any) => {
        const msg = err.response?.data?.error || err.message || 'Error al guardar';
        alerts.error(msg);
        console.error("Detalle del error:", err.response || err);
      }
    });

    const onSubmit = (data: any) => {
      createMat.mutate({
        ...data,
        unidad: data.unidad || 'Unidad',
        stockActual: Number(data.stockActual),
        stockMinimo: Number(data.stockMinimo),
        costoUnitario: Number(data.costoUnitario)
      });
    };

    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-bold mb-4">Registrar Nuevo Material</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-7 gap-4 items-end">
            <div className="col-span-1"><Input label="Código" {...register('codigo')} required /></div>
            <div className="col-span-2"><Input label="Descripción" {...register('nombre')} required /></div>
            <div className="col-span-1">
              <Select label="Und" {...register('unidad')} options={[{value:'Unidad', label:'Und'}, {value:'Litros', label:'Lts'}, {value:'Galones', label:'Gal'}, {value:'Kilos', label:'Kg'}]} />
            </div>
            <div className="col-span-1"><Input label="Stock Inicial" type="number" step="0.1" {...register('stockActual')} required /></div>
            <div className="col-span-1"><Input label="Costo" type="number" step="0.01" {...register('costoUnitario')} required /></div>
            <div className="col-span-1"><Button type="submit" className="w-full h-10" isLoading={createMat.isPending}>Guardar</Button></div>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Control de Materiales</h1>
          <p className="text-sm text-gray-500">Atención de solicitudes y control de stock del almacén.</p>
        </div>
        <div className="bg-slate-100 p-2 rounded-full">
          <Package className="h-6 w-6 text-slate-600" />
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'solicitudes' ? 'border-b-2 border-slate-600 text-slate-900' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('solicitudes')}
        >
          Solicitudes Pendientes
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'catalogo' ? 'border-b-2 border-slate-600 text-slate-900' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('catalogo')}
        >
          Catálogo / Stock Actual
        </button>
      </div>

      {activeTab === 'solicitudes' ? (
        <Card>
          <CardContent>
            <DataTable 
              columns={columnsSolicitudes}
              data={solicitudes}
              isLoading={loadingSol}
              emptyMessage="No hay solicitudes de materiales."
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <FormNuevoMaterial />
          <Card>
            <CardContent>
              <DataTable 
                columns={columnsMateriales}
                data={materiales}
                isLoading={loadingMat}
                emptyMessage="No hay materiales en el catálogo."
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
