import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, FileText, AlertTriangle, Upload, CheckCircle } from 'lucide-react';
import { conductorService } from '../../../services/conductor.service';
import { Card, CardContent } from '../../../components/ui/Card';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { api } from '../../../services/api';
import { alerts } from '../../../utils/alerts';

export default function DocumentacionPersonal() {
  const queryClient = useQueryClient();
  const [selectedConductor, setSelectedConductor] = useState<any>(null);

  const { data: conductores = [], isLoading } = useQuery({
    queryKey: ['conductores'],
    queryFn: conductorService.getAll
  });

  const saveDocMut = useMutation({
    mutationFn: async (payload: { conductorId: number, tipo: string, vigencia: string }) => {
      const { data } = await api.post(`/conductores/${payload.conductorId}/documentos`, {
        tipo: payload.tipo,
        vigencia: new Date(payload.vigencia).toISOString()
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conductores'] });
      alerts.success('Documento actualizado correctamente en BD');
    }
  });

  const checkVigencia = (fechaStr: string) => {
    if (!fechaStr) return 'FALTANTE';
    const fecha = new Date(fechaStr);
    const hoy = new Date();
    const mesesRestantes = (fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24 * 30);
    
    if (mesesRestantes < 0) return 'VENCIDO';
    if (mesesRestantes <= 1) return 'POR_VENCER';
    return 'VIGENTE';
  };

  const findDoc = (docs: any[], tipo: string) => {
    if (!docs || docs.length === 0) return null;
    // Get latest doc of that type
    const ofType = docs.filter(d => d.tipo === tipo);
    if (ofType.length === 0) return null;
    return ofType.sort((a, b) => new Date(b.fechaSubida).getTime() - new Date(a.fechaSubida).getTime())[0];
  };

  const columns = [
    { key: 'nombres', header: 'Nombre', render: (d: any) => `${d.nombre}` },
    { key: 'licencia', header: 'Documento', render: (d: any) => d.documento },
    { 
      key: 'estadoLic', 
      header: 'Estado Licencia',
      render: (d: any) => {
        const doc = findDoc(d.documentos, 'LICENCIA');
        const estado = checkVigencia(doc?.vigencia);
        return (
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            estado === 'VIGENTE' ? 'bg-emerald-100 text-emerald-800' :
            estado === 'POR_VENCER' ? 'bg-amber-100 text-amber-800' :
            'bg-red-100 text-red-800'
          }`}>
            {estado}
          </span>
        );
      }
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (d: any) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedConductor(d)}>
          Ver Expediente
        </Button>
      )
    }
  ];

  const Expediente = () => {
    if (!selectedConductor) return null;
    // Re-find conductor to get latest docs from cache
    const conductor = conductores.find((c: any) => c.conductorId === selectedConductor.conductorId) || selectedConductor;
    const cid = conductor.conductorId;

    const DocItem = ({ tipo, titulo }: { tipo: string, titulo: string }) => {
      const doc = findDoc(conductor.documentos, tipo);
      const estado = checkVigencia(doc?.vigencia);
      return (
        <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
          <div className="flex items-center">
            {estado === 'VIGENTE' ? (
              <CheckCircle className="h-8 w-8 text-emerald-500 mr-4" />
            ) : estado === 'POR_VENCER' ? (
              <AlertTriangle className="h-8 w-8 text-amber-500 mr-4" />
            ) : (
              <FileText className="h-8 w-8 text-red-500 mr-4" />
            )}
            <div>
              <h4 className="font-bold text-gray-900">{titulo}</h4>
              <p className="text-sm text-gray-500">
                {doc ? `Vence: ${new Date(doc.vigencia).toLocaleDateString()}` : 'Documento no cargado'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <input 
              type="date" 
              className="border rounded px-2 py-1 text-sm"
              onChange={(e) => {
                if(e.target.value) saveDocMut.mutate({ conductorId: cid, tipo, vigencia: e.target.value });
              }}
            />
          </div>
        </div>
      );
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">Expediente: {conductor.nombre}</h3>
              <p className="text-gray-500">Doc: {conductor.documento}</p>
            </div>
            <Button variant="ghost" onClick={() => setSelectedConductor(null)}>Cerrar</Button>
          </div>
          
          <div className="space-y-2">
            <DocItem tipo="LICENCIA" titulo="Licencia de Conducir (Brevete)" />
            <DocItem tipo="DNI" titulo="Documento de Identidad (DNI)" />
            <DocItem tipo="EXAMEN_MEDICO" titulo="Examen Médico Ocupacional" />
            <DocItem tipo="CAPACITACION" titulo="Certificado de Capacitación" />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentación de Personal</h1>
          <p className="text-sm text-gray-500">Soporte documental del personal en la BD.</p>
        </div>
        <div className="bg-slate-100 p-2 rounded-full">
          <Users className="h-6 w-6 text-slate-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={selectedConductor ? "lg:col-span-1" : "lg:col-span-3"}>
          <Card className="h-full">
            <CardContent className="p-0">
              <DataTable 
                columns={columns}
                data={conductores}
                isLoading={isLoading}
                emptyMessage="No hay conductores registrados."
              />
            </CardContent>
          </Card>
        </div>
        
        {selectedConductor && (
          <div className="lg:col-span-2">
            <Expediente />
          </div>
        )}
      </div>
    </div>
  );
}
