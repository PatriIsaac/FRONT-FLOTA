import { useQuery } from '@tanstack/react-query';
import { Settings, Activity } from 'lucide-react';
import { vehiculoService } from '../../../services/vehiculo.service';
import { movimientoService } from '../../../services/movimiento.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Badge } from '../../../components/ui/Badge';
import type { Vehiculo } from '../../../types/vehiculo';

export default function ProgramacionPreventivo() {
  const { data: vehiculos = [], isLoading: loadVehiculos } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll
  });

  const { data: movimientos = [], isLoading: loadMov } = useQuery({
    queryKey: ['movimientos'],
    queryFn: movimientoService.getAll
  });

  // Cálculo simulado de mantenimiento basado en kilometraje
  const dataProgramacion = vehiculos.map((v: Vehiculo) => {
    // Buscar el último movimiento para ver km actual
    const vehiculoMovimientos = movimientos.filter(m => m.vehiculoId === v.vehiculoId);
    let kmActual = 0;
    if (vehiculoMovimientos.length > 0) {
      // ordenar por fecha desc
      vehiculoMovimientos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      kmActual = vehiculoMovimientos[0].kmLlegada;
    }

    // Parámetro de mantenimiento cada 5000 km. El próximo hito es siempre el siguiente
    // múltiplo del intervalo por encima del km actual, de modo que un vehículo sin
    // kilometraje acumulado queda con el intervalo completo por recorrer (prioridad baja).
    const intervaloMtto = 5000;
    const proximoMtto = (Math.floor(kmActual / intervaloMtto) + 1) * intervaloMtto;
    const kmRestantes = proximoMtto - kmActual;
    const urgencia = kmRestantes <= 500 ? 'ALTA' : kmRestantes <= 1500 ? 'MEDIA' : 'BAJA';

    return {
      id: v.vehiculoId,
      vehiculo: v,
      kmActual,
      proximoMtto,
      kmRestantes,
      urgencia
    };
  });

  const columns = [
    { 
      key: 'vehiculo', 
      header: 'Vehículo',
      render: (d: any) => `${d.vehiculo.placa} (${d.vehiculo.codigoPatrimonio})`
    },
    { 
      key: 'kmActual', 
      header: 'Km Actual',
      render: (d: any) => <span className="font-medium text-gray-700">{d.kmActual.toLocaleString()}</span>
    },
    { 
      key: 'proximoMtto', 
      header: 'Próximo Mtto. a los (Km)',
      render: (d: any) => <span className="font-medium text-blue-600">{d.proximoMtto.toLocaleString()}</span>
    },
    { 
      key: 'kmRestantes', 
      header: 'Km Restantes',
      render: (d: any) => <span className="font-bold text-gray-900">{d.kmRestantes.toLocaleString()}</span>
    },
    { 
      key: 'urgencia', 
      header: 'Prioridad',
      render: (d: any) => (
        <Badge variant={d.urgencia === 'ALTA' ? 'danger' : d.urgencia === 'MEDIA' ? 'warning' : 'success'}>
          {d.urgencia}
        </Badge>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programación de Mantenimiento Preventivo</h1>
          <p className="text-sm text-gray-500">Programación por kilometraje a partir del movimiento acumulado de la unidad.</p>
        </div>
        <div className="bg-emerald-100 p-2 rounded-full">
          <Settings className="h-6 w-6 text-emerald-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Unidades en Alerta Roja</p>
              <h3 className="text-2xl font-bold text-red-600">
                {dataProgramacion.filter(d => d.urgencia === 'ALTA').length}
              </h3>
            </div>
            <div className="bg-red-100 p-2 rounded-lg"><Activity className="h-6 w-6 text-red-600" /></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <DataTable
            enableColumnFilters={true} 
            columns={columns}
            data={dataProgramacion}
            isLoading={loadVehiculos || loadMov}
            emptyMessage="No hay vehículos registrados."
          />
        </CardContent>
      </Card>
    </div>
  );
}
