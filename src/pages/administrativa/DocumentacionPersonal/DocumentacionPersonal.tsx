import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, FileText, AlertTriangle, Upload, CheckCircle, Trash2 } from 'lucide-react';
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
    mutationFn: async (formData: any) => {
      const { administrativaService } = await import('../../../services/administrativa.service');
      const data = await administrativaService.createDocumento(formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conductores'] });
      alerts.success('Documento guardado correctamente');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message || 'Error al guardar';
      alerts.error(msg);
      console.error("Detalle del error:", err.response || err);
    }
  });

  const deleteDocMut = useMutation({
    mutationFn: async (id: number) => {
      const { administrativaService } = await import('../../../services/administrativa.service');
      await administrativaService.deleteDocumento(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conductores'] });
      alerts.success('Documento eliminado');
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
      
      const handleSave = () => {
        const dateInput = document.getElementById(`date-${tipo}`) as HTMLInputElement;
        const fileInput = document.getElementById(`file-${tipo}`) as HTMLInputElement;
        if (!dateInput.value) {
            return alerts.error('Debe ingresar la fecha de vencimiento');
        }
        
        const formData = new FormData();
        formData.append('conductorId', cid.toString());
        formData.append('tipo', tipo);
        formData.append('vigencia', dateInput.value);
        formData.append('fechaSubida', new Date().toISOString());
        
        if (fileInput.files && fileInput.files.length > 0) {
            formData.append('archivo', fileInput.files[0]);
        }
        
        saveDocMut.mutate(formData);
      };

      return (
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-5 border border-gray-700/50 rounded-xl mb-4 gap-6 bg-gray-800/20 hover:bg-gray-800/40 transition-colors">
          <div className="flex items-center min-w-[220px]">
            {estado === 'VIGENTE' ? (
              <CheckCircle className="h-8 w-8 text-emerald-500 mr-4 shrink-0" />
            ) : estado === 'POR_VENCER' ? (
              <AlertTriangle className="h-8 w-8 text-amber-500 mr-4 shrink-0" />
            ) : (
              <FileText className="h-8 w-8 text-red-500 mr-4 shrink-0" />
            )}
            <div>
              <h4 className="font-bold text-gray-100 text-sm md:text-base">{titulo}</h4>
              <p className="text-xs md:text-sm text-gray-400 mt-1">
                {doc ? `Vence: ${new Date(doc.vigencia).toLocaleDateString()}` : 'Documento no cargado'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-end flex-1 justify-end w-full xl:w-auto">
            {doc?.archivoUrl && (
              <div className="flex items-center gap-2 mb-2 xl:mb-0 mr-4">
                <a href={`http://localhost:3000${doc.archivoUrl}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline flex items-center px-2 py-1 rounded bg-blue-500/10">
                  <FileText className="w-4 h-4 mr-2" /> Ver PDF
                </a>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0" onClick={() => deleteDocMut.mutate(doc.documentoId)} title="Eliminar Documento">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <div className="h-6 w-px bg-gray-700 mx-2 hidden xl:block"></div>
              </div>
            )}
            
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Vencimiento</span>
              <input 
                type="date" 
                id={`date-${tipo}`}
                className="border border-gray-600 bg-gray-800/50 rounded-lg px-3 py-2 text-sm h-10 w-full sm:w-40 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-[200px] max-w-[300px]">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Archivo PDF (Opcional)</span>
              <input 
                type="file" 
                id={`file-${tipo}`}
                accept=".pdf"
                className="border border-gray-600 bg-gray-800/50 rounded-lg px-2 py-1.5 text-sm h-10 w-full text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-500/20 file:text-blue-400 cursor-pointer"
              />
            </div>
            <div className="flex items-end">
              <Button size="sm" onClick={handleSave} isLoading={saveDocMut.isPending} className="h-10 px-5 font-semibold">
                <Upload className="w-4 h-4 mr-2" /> Subir
              </Button>
            </div>
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
          
          <div className="flex flex-col gap-2">
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
    <div className="flex flex-col gap-6 animate-in fade-in">
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
            <CardContent>
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
