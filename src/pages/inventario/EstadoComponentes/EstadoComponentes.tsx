import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Disc, Settings, AlertTriangle } from 'lucide-react';
import { inventarioService } from '../../../services/inventario.service';
import { vehiculoService } from '../../../services/vehiculo.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

export default function EstadoComponentes() {
  const [selectedVehiculoId, setSelectedVehiculoId] = useState<number>(0);

  const { data: vehiculos = [] } = useQuery({ queryKey: ['vehiculos'], queryFn: vehiculoService.getAll });
  
  const { data: llantas = [], isLoading: loadingLlantas } = useQuery({ 
    queryKey: ['llantas'], 
    queryFn: inventarioService.getAllLlantas 
  });
  
  const { data: conjuntos = [], isLoading: loadingConjuntos } = useQuery({ 
    queryKey: ['conjuntos'], 
    queryFn: inventarioService.getAllConjuntos 
  });

  const vehiculoActual = vehiculos.find((v: any) => v.vehiculoId === selectedVehiculoId);
  const llantasInstaladas = llantas.filter((l: any) => l.vehiculoId === selectedVehiculoId);
  const conjuntosInstalados = conjuntos.filter((c: any) => c.vehiculoId === selectedVehiculoId);

  const posicionesLlanta = [
    { id: 'DELANTERA_IZQ', label: 'Delantera Izquierda' },
    { id: 'DELANTERA_DER', label: 'Delantera Derecha' },
    { id: 'POSTERIOR_INT_IZQ', label: 'Posterior Int. Izq.' },
    { id: 'POSTERIOR_EXT_IZQ', label: 'Posterior Ext. Izq.' },
    { id: 'POSTERIOR_INT_DER', label: 'Posterior Int. Der.' },
    { id: 'POSTERIOR_EXT_DER', label: 'Posterior Ext. Der.' },
    { id: 'REPUESTO', label: 'Repuesto' }
  ];

  const getColorPorEstado = (estado: string) => {
    switch(estado) {
      case 'NUEVA': case 'NUEVO': return 'border-emerald-500 bg-emerald-50 text-emerald-700';
      case 'REENCAUCHADA': case 'REPARADO': return 'border-blue-500 bg-blue-50 text-blue-700';
      case 'PARA_REENCAUCHE': case 'MANTENIMIENTO': return 'border-amber-500 bg-amber-50 text-amber-700';
      case 'DE_BAJA': return 'border-red-500 bg-red-50 text-red-700';
      default: return 'border-gray-300 bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consulta de Estado de Componentes</h1>
          <p className="text-sm text-gray-500">Consulta gráfica del estado actual de llantas y conjuntos mayores.</p>
        </div>
        <div className="bg-blue-100 p-2 rounded-full">
          <Search className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      <Card className="bg-gray-50 border-none">
        <CardContent className="p-6 flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Vehículo</label>
            <select 
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedVehiculoId}
              onChange={(e) => setSelectedVehiculoId(Number(e.target.value))}
            >
              <option value={0}>Seleccione un vehículo para consultar...</option>
              {vehiculos.map((v: any) => (
                <option key={v.vehiculoId} value={v.vehiculoId}>{v.placa} - {v.codigoPatrimonio}</option>
              ))}
            </select>
          </div>
          <Button onClick={() => {}} className="bg-blue-600 hover:bg-blue-700 h-10">
            <Search className="w-4 h-4 mr-2" /> Consultar
          </Button>
        </CardContent>
      </Card>

      {selectedVehiculoId > 0 && vehiculoActual && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Llantas */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold flex items-center mb-6">
                <Disc className="w-5 h-5 mr-2 text-cyan-600" /> Llantas Instaladas
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {posicionesLlanta.map(pos => {
                  const llanta = llantasInstaladas.find((l: any) => l.posicion === pos.id);
                  return (
                    <div key={pos.id} className={`p-4 border-l-4 rounded-r-lg shadow-sm ${llanta ? getColorPorEstado(llanta.estado) : 'border-gray-300 bg-gray-50'}`}>
                      <p className="text-xs font-bold uppercase mb-1">{pos.label}</p>
                      {llanta ? (
                        <>
                          <p className="font-bold text-lg">{llanta.codigo}</p>
                          <p className="text-sm">{llanta.dimension}</p>
                          <p className="text-xs font-semibold mt-2">{llanta.estado}</p>
                        </>
                      ) : (
                        <div className="flex items-center text-gray-400 mt-2">
                          <AlertTriangle className="w-4 h-4 mr-1" /> Sin Registrar
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Conjuntos Mayores */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold flex items-center mb-6">
                <Settings className="w-5 h-5 mr-2 text-blue-600" /> Conjuntos Mayores Instalados
              </h3>
              
              {conjuntosInstalados.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {conjuntosInstalados.map((conjunto: any) => (
                    <div key={conjunto.conjuntoId} className={`p-4 border-l-4 rounded-r-lg shadow-sm ${getColorPorEstado(conjunto.estado)}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold uppercase mb-1">{conjunto.tipo.replace('_', ' ')}</p>
                          <p className="font-bold text-lg">{conjunto.codigo}</p>
                          <p className="text-sm">Instalado: {conjunto.fechaInstalacion ? new Date(conjunto.fechaInstalacion).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <span className="px-2 py-1 bg-white/50 rounded text-xs font-bold">
                          {conjunto.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  <Settings className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No hay conjuntos mayores registrados en este vehículo.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
