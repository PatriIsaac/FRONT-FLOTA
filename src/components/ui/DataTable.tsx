import React, { useMemo, useState } from 'react';
import { cn } from '../../utils/cn';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface DataTableProps<T> {
  columns: {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  /** Filas por página. Si se omite, la tabla no pagina (listas cortas). */
  pageSize?: number;
  /** Habilita una fila adicional en el encabezado con inputs de texto para filtrar por columna */
  enableColumnFilters?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No hay datos disponibles',
  className,
  pageSize,
  enableColumnFilters = false,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    if (!enableColumnFilters) return data;
    return data.filter(item => {
      return Object.entries(columnFilters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        // Search inside the whole item for any match since 'key' might be complex (e.g. nested property rendered differently).
        // This is a simple generic text match on the serialized object values.
        const val = item[key as keyof T];
        if (val !== undefined && val !== null) {
            return String(val).toLowerCase().includes(filterValue.toLowerCase());
        }
        return JSON.stringify(item).toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [data, columnFilters, enableColumnFilters]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(filteredData.length / pageSize)) : 1;
  const pageSafe = Math.min(page, totalPages);
  
  const pageData = useMemo(() => {
    if (!pageSize) return filteredData;
    const start = (pageSafe - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pageSize, pageSafe]);

  const getColumnClasses = (header: string, colClassName?: string) => {
    const h = header.toLowerCase();
    const isShort = ['estado', 'acciones', 'vida útil', 'placa', 'código', 'cod.', 'fecha', 'rol', 'dni'].some(word => h.includes(word));
    return cn(
      'px-2 py-2 align-middle',
      isShort && 'w-px whitespace-nowrap',
      colClassName
    );
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full overflow-auto rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]">
        <table className="w-full text-sm text-left">
          <thead className="bg-[var(--table-head-bg)] border-b border-[var(--border-color)]">
            <tr>
              {columns.map((col, index) => (
                <th key={String(col.key) + index} className={cn(getColumnClasses(col.header, (col as any).className), "font-medium text-[color:var(--text-secondary)]")}>
                  {col.header}
                </th>
              ))}
            </tr>
            {enableColumnFilters && (
              <tr className="bg-[var(--table-head-bg)] border-b border-[var(--border-color)]">
                {columns.map((col, index) => {
                  const h = col.header.toLowerCase();
                  const isActionOrState = h.includes('acciones') || h.includes('estado');
                  return (
                    <th key={'filter-' + String(col.key) + index} className="px-2 py-1 align-middle font-normal">
                      {!isActionOrState && (
                        <input
                          type="text"
                          placeholder={`Buscar...`}
                          value={columnFilters[col.key as string] || ''}
                          onChange={(e) => setColumnFilters(prev => ({ ...prev, [col.key as string]: e.target.value }))}
                          className="w-full text-xs p-1.5 rounded-md border border-[var(--border-color)] bg-[var(--input-bg)] text-[color:var(--text-primary)] placeholder-[color:var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-[var(--border-color)] text-[color:var(--text-primary)]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-2 py-8 text-center align-middle">
                  <div className="flex justify-center items-center text-[color:var(--text-secondary)]">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Cargando...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-2 py-8 text-center text-[color:var(--text-secondary)] align-middle">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageData.map((item, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-[var(--table-row-hover)] transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={String(col.key) + colIndex} className={getColumnClasses(col.header, (col as any).className)}>
                      {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageSize && !isLoading && filteredData.length > pageSize && (
        <div className="flex items-center justify-between px-1 pt-3 text-sm text-[color:var(--text-secondary)]">
          <span>
            {(pageSafe - 1) * pageSize + 1}–{Math.min(pageSafe * pageSize, filteredData.length)} de {filteredData.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={pageSafe <= 1}
              className="p-1.5 rounded-md border border-[var(--border-color)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--input-bg)] transition-colors"
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>Página {pageSafe} de {totalPages}</span>
            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={pageSafe >= totalPages}
              className="p-1.5 rounded-md border border-[var(--border-color)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--input-bg)] transition-colors"
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
