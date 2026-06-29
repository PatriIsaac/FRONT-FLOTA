import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

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
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No hay datos disponibles',
  className
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto rounded-md border border-[var(--border-color)] bg-[var(--card-bg)]", className)}>
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
            data.map((item, rowIndex) => (
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
  );
}
