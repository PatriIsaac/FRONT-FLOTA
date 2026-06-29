import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Disc, Settings, Save, Trash2 } from 'lucide-react';
import { inventarioService } from '../../../services/inventario.service';
import { vehiculoService } from '../../../services/vehiculo.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { alerts } from '../../../utils/alerts';

export default function FichaLlantaConjunto() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('llantas'); // 'llantas' | 'conjuntos'

  const { data: vehiculos = [] } = useQuery({ queryKey: ['vehiculos'], queryFn: vehiculoService.getAll });
  
  const { data: llantas = [], isLoading: loadingLlantas } = useQuery({ 
    queryKey: ['llantas'], 
    queryFn: inventarioService.getAllLlantas 
  });
  
  const { data: conjuntos = [], isLoading: loadingConjuntos } = useQuery({ 
    queryKey: ['conjuntos'], 
    queryFn: inventarioService.getAllConjuntos 
  });

  // Mutaciones Llantas
  const createLlanta = useMutation({
    mutationFn: inventarioService.createLlanta,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['llantas'] }); alerts.success('Llanta registrada'); resetLlanta(); }
  });
  const deleteLlanta = useMutation({
    mutationFn: inventarioService.deleteLlanta,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['llantas'] }); alerts.success('Eliminada'); }
  });

  // Mutaciones Conjuntos
  const createConjunto = useMutation({
    mutationFn: inventarioService.createConjunto,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['conjuntos'] }); alerts.success('Conjunto registrado'); resetConjunto(); }
  });
  const deleteConjunto = useMutation({
    mutationFn: inventarioService.deleteConjunto,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['conjuntos'] }); alerts.success('Eliminado'); }
  });

  // Formularios
  const { register: regLlanta, handleSubmit: handleLlanta, reset: resetLlanta, formState: { errors: errLlanta } } = useForm();
  const { register: regConj, handleSubmit: handleConj, reset: resetConjunto, formState: { errors: errConj } } = useForm();

  const onLlantaSubmit = (data: any) => {
    createLlanta.mutate({ ...data, vehiculoId: Number(data.vehiculoId), costo: Number(data.costo) });
  };
  const onConjuntoSubmit = (data: any) => {
    createConjunto.mutate({ ...data, vehiculoId: Number(data.vehiculoId), costo: Number(data.costo) });
  };

  const columnsLlantas = [
    { key: 'codigo', header: 'Código Llanta' },
    { key: 'vehiculo', header: 'Vehículo', render: (d: any) => d.vehiculo?.placa },
    { key: 'posicion', header: 'Posición' },
    { key: 'dimension', header: 'Dimensión / Diseño' },
    { key: 'estado', header: 'Estado', render: (d: any) => <span className={`font-bold ${d.estado==='NUEVA'?'text-emerald-600':d.estado==='REENCAUCHADA'?'text-blue-600':'text-amber-600'}`}>{d.estado}</span> },
    { key: 'acciones', header: 'Acciones', render: (d: any) => <Button variant="ghost" size="sm" onClick={() => deleteLlanta.mutate(d.llantaId)}><Trash2 className="w-4 h-4 text-red-500"/></Button> }
  ];

  const columnsConjuntos = [
    { key: 'codigo', header: 'Código Conjunto' },
    { key: 'vehiculo', header: 'Vehículo', render: (d: any) => d.vehiculo?.placa },
    { key: 'tipo', header: 'Tipo (Motor/Caja)' },
    { key: 'estado', header: 'Estado', render: (d: any) => <span className="font-bold">{d.estado}</span> },
    { key: 'fechaInstalacion', header: 'Instalación', render: (d: any) => d.fechaInstalacion ? new Date(d.fechaInstalacion).toLocaleDateString() : '-' },
    { key: 'acciones', header: 'Acciones', render: (d: any) => <Button variant="ghost" size="sm" onClick={() => deleteConjunto.mutate(d.conjuntoId)}><Trash2 className="w-4 h-4 text-red-500"/></Button> }
  ];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ficha Técnica de Componentes Mayores</h1>
          <p className="text-sm text-gray-500">Registro y trazabilidad de Llantas y Conjuntos (Motores, Cajas de Cambio).</p>
        </div>
        <div className="bg-cyan-100 p-2 rounded-full">
          <Settings className="h-6 w-6 text-cyan-600" />
        </div>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors flex items-center ${activeTab === 'llantas' ? 'border-b-2 border-cyan-600 text-cyan-900' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('llantas')}
        >
          <Disc className="w-4 h-4 mr-2" /> Gestión de Llantas
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors flex items-center ${activeTab === 'conjuntos' ? 'border-b-2 border-cyan-600 text-cyan-900' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('conjuntos')}
        >
          <Settings className="w-4 h-4 mr-2" /> Conjuntos Mayores
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4 border-b pb-2">
              Registrar {activeTab === 'llantas' ? 'Nueva Llanta' : 'Nuevo Conjunto'}
            </h3>
            
            {activeTab === 'llantas' ? (
              <form onSubmit={handleLlanta(onLlantaSubmit)} className="space-y-4">
                <Input label="Código Único" placeholder="LL-001" {...regLlanta('codigo', {required:true})} />
                <Select label="Vehículo Instalado" {...regLlanta('vehiculoId')} options={[{value:0,label:'En Almacén / No Instalada'}, ...vehiculos.map((v:any)=>({value:v.vehiculoId, label:v.placa}))]} />
                <Input label="Dimensión / Diseño" placeholder="295/80 R22.5" {...regLlanta('dimension', {required:true})} />
                <Select label="Posición" {...regLlanta('posicion')} options={[
                  {value:'DELANTERA_IZQ',label:'Delantera Izquierda'},{value:'DELANTERA_DER',label:'Delantera Derecha'},
                  {value:'POSTERIOR_INT_IZQ',label:'Posterior Int. Izq.'},{value:'POSTERIOR_EXT_IZQ',label:'Posterior Ext. Izq.'},
                  {value:'POSTERIOR_INT_DER',label:'Posterior Int. Der.'},{value:'POSTERIOR_EXT_DER',label:'Posterior Ext. Der.'},
                  {value:'REPUESTO',label:'Llanta de Repuesto'},{value:'ALMACEN',label:'En Almacén'}
                ]} />
                <Select label="Estado Físico" {...regLlanta('estado')} options={[{value:'NUEVA',label:'Nueva'},{value:'REENCAUCHADA',label:'Reencauchada'},{value:'PARA_REENCAUCHE',label:'Para Reencauche'},{value:'DE_BAJA',label:'De Baja'}]} />
                <Input label="Costo (S/.)" type="number" step="0.01" {...regLlanta('costo')} />
                <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" isLoading={createLlanta.isPending}>
                  <Save className="w-4 h-4 mr-2"/> Guardar Llanta
                </Button>
              </form>
            ) : (
              <form onSubmit={handleConj(onConjuntoSubmit)} className="space-y-4">
                <Input label="Código Único / Serie" placeholder="M-12345" {...regConj('codigo', {required:true})} />
                <Select label="Tipo de Conjunto" {...regConj('tipo')} options={[{value:'MOTOR',label:'Motor Completo'},{value:'CAJA_CAMBIOS',label:'Caja de Cambios'},{value:'CORONA',label:'Diferencial / Corona'}]} />
                <Select label="Vehículo Instalado" {...regConj('vehiculoId')} options={[{value:0,label:'En Almacén'}, ...vehiculos.map((v:any)=>({value:v.vehiculoId, label:v.placa}))]} />
                <Input label="Fecha Instalación" type="date" {...regConj('fechaInstalacion')} />
                <Select label="Estado Físico" {...regConj('estado')} options={[{value:'NUEVO',label:'Nuevo (Estándar)'},{value:'REPARADO',label:'Reparado / Overhaul'},{value:'MANTENIMIENTO',label:'En Reparación'},{value:'DE_BAJA',label:'De Baja'}]} />
                <Input label="Costo (S/.)" type="number" step="0.01" {...regConj('costo')} />
                <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700" isLoading={createConjunto.isPending}>
                  <Save className="w-4 h-4 mr-2"/> Guardar Conjunto
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-0">
              {activeTab === 'llantas' ? (
                <DataTable columns={columnsLlantas} data={llantas} isLoading={loadingLlantas} emptyMessage="No hay llantas registradas." />
              ) : (
                <DataTable columns={columnsConjuntos} data={conjuntos} isLoading={loadingConjuntos} emptyMessage="No hay conjuntos registrados." />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
