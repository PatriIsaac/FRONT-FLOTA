import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Upload, FileText, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { costoService } from '../../../services/costo.service';
import { vehiculoService } from '../../../services/vehiculo.service';
import { alerts } from '../../../utils/alerts';
import { cn } from '../../../utils/cn';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface CsvRow {
  Placa: string;
  MesAnio: string;
  CFP: string | number;
  CFV: string | number;
}

interface ProcessedRow {
  vehiculoId: number;
  placa: string;
  mesAnio: string;
  cfp: number;
  cfv: number;
  isValid: boolean;
  error?: string;
}

export default function ImportarCSVModal({ isOpen, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processedRows, setProcessedRows] = useState<ProcessedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll,
    enabled: isOpen
  });

  const resetState = () => {
    setFile(null);
    setProcessedRows([]);
    setProgress(0);
    setIsImporting(false);
    setIsProcessing(false);
  };

  const processFile = (fileToProcess: File) => {
    if (!fileToProcess.name.endsWith('.csv')) {
      alerts.error('Por favor, selecciona un archivo CSV válido.');
      return;
    }
    
    setFile(fileToProcess);
    setIsProcessing(true);

    Papa.parse<CsvRow>(fileToProcess, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map((row, index) => {
          const placa = (row.Placa || '').trim().toUpperCase();
          const mesAnio = (row.MesAnio || '').trim();
          const cfp = parseFloat(String(row.CFP));
          const cfv = parseFloat(String(row.CFV));

          const processed: ProcessedRow = {
            vehiculoId: 0,
            placa,
            mesAnio,
            cfp: isNaN(cfp) ? 0 : cfp,
            cfv: isNaN(cfv) ? 0 : cfv,
            isValid: true
          };

          if (!placa) {
            processed.isValid = false;
            processed.error = 'Falta Placa';
            return processed;
          }

          if (!/^\d{4}-\d{2}$/.test(mesAnio)) {
            processed.isValid = false;
            processed.error = 'MesAnio inválido (use YYYY-MM)';
            return processed;
          }

          if (isNaN(cfp) || isNaN(cfv) || cfp < 0 || cfv < 0) {
            processed.isValid = false;
            processed.error = 'CFP o CFV inválido';
            return processed;
          }

          const vehiculoEncontrado = vehiculos.find(v => v.placa.toUpperCase() === placa);
          if (!vehiculoEncontrado) {
            processed.isValid = false;
            processed.error = `Vehículo ${placa} no existe`;
            return processed;
          }

          processed.vehiculoId = vehiculoEncontrado.vehiculoId;
          return processed;
        });

        setProcessedRows(rows);
        setIsProcessing(false);
      },
      error: () => {
        alerts.error('Error al leer el archivo CSV');
        setIsProcessing(false);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    const validRows = processedRows.filter(r => r.isValid);
    if (validRows.length === 0) return;

    setIsImporting(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i];
      try {
        await costoService.create({
          vehiculoId: row.vehiculoId,
          mesAnio: row.mesAnio,
          cfp: row.cfp,
          cfv: row.cfv
        });
        successCount++;
      } catch (err) {
        errorCount++;
      }
      setProgress(Math.round(((i + 1) / validRows.length) * 100));
    }

    queryClient.invalidateQueries({ queryKey: ['costos'] });
    setIsImporting(false);

    if (errorCount === 0) {
      alerts.success(`Se importaron ${successCount} registros correctamente.`);
      handleClose();
    } else {
      alerts.success(`Se importaron ${successCount} registros. Hubo ${errorCount} errores.`);
    }
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validCount = processedRows.filter(r => r.isValid).length;
  const invalidCount = processedRows.length - validCount;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importar Costos (CSV)">
      <div className="flex flex-col" style={{ gap: '24px' }}>
        
        {!file && (
          <div 
            className={cn(
              "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
              isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Haz clic o arrastra un archivo</h3>
            <p className="text-sm text-gray-500 mb-4">Solo archivos .CSV con las columnas esperadas</p>
            <Button variant="secondary" type="button" size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              Seleccionar Archivo
            </Button>
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
          </div>
        )}

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Procesando archivo...</p>
          </div>
        )}

        {file && !isProcessing && (
          <div className="flex flex-col" style={{ gap: '16px' }}>
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <FileText className="h-8 w-8 text-indigo-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB • {processedRows.length} filas</p>
              </div>
              {!isImporting && (
                <button onClick={resetState} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <XCircle className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-900">Listos para importar</p>
                  <p className="text-2xl font-bold text-green-700">{validCount}</p>
                </div>
              </div>
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-900">Con errores (se omitirán)</p>
                  <p className="text-2xl font-bold text-red-700">{invalidCount}</p>
                </div>
              </div>
            </div>

            {invalidCount > 0 && (
              <div className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 max-h-32 overflow-y-auto">
                <p className="font-semibold mb-1">Errores encontrados:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {processedRows.filter(r => !r.isValid).slice(0, 10).map((r, idx) => (
                    <li key={idx}>Fila con placa "{r.placa || 'Vacía'}": {r.error}</li>
                  ))}
                  {invalidCount > 10 && <li>... y {invalidCount - 10} más.</li>}
                </ul>
              </div>
            )}

            {isImporting && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Importando...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            Columnas esperadas: Placa, MesAnio, CFP, CFV
          </div>
          <div className="flex gap-4">
            <Button variant="outline" type="button" onClick={handleClose} disabled={isImporting}>Cancelar</Button>
            <Button 
              type="button" 
              onClick={handleImport}
              disabled={validCount === 0 || isImporting || isProcessing || !file}
            >
              {isImporting ? 'Importando...' : `Importar ${validCount} registros`}
            </Button>
          </div>
        </div>

      </div>
    </Modal>
  );
}
