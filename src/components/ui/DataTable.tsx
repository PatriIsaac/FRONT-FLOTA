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
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No hay datos disponibles',
  className,
  pageSize,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = pageSize ? Math.max(1, Math.ceil(data.length / pageSize)) : 1;
  const pageSafe = Math.min(page, totalPages);
  const pageData = useMemo(() => {
    if (!pageSize) return data;
    const start = (pageSafe - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, pageSize, pageSafe]);

  return (
    <div className={cn("w-full", className)}>
      <div className="w-full overflow-auto rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]">
        <table className="w-full text-sm text-left">
          <thead className="bg-[var(--table-head-bg)] border-b border-[var(--border-color)]">
            <tr>
              {columns.map((col, index) => (
                <th key={String(col.key) + index} className="px-4 py-3 font-medium text-[color:var(--text-secondary)]">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)] text-[color:var(--text-primary)]">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center">
                  <div className="flex justify-center items-center text-[color:var(--text-secondary)]">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Cargando...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-[color:var(--text-secondary)]">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageData.map((item, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-[var(--table-row-hover)] transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={String(col.key) + colIndex} className="px-4 py-3">
                      {col.render ? col.render(item) : (item[col.key as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageSize && !isLoading && data.length > pageSize && (
        <div className="flex items-center justify-between px-1 pt-3 text-sm text-[color:var(--text-secondary)]">
          <span>
            {(pageSafe - 1) * pageSize + 1}–{Math.min(pageSafe * pageSize, data.length)} de {data.length}
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
