import './DataTable.css';

interface Column<T> {
  key: keyof T;
  header: string;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  rows: T[];
  caption?: string;
}

export function DataTable<T extends { id: string }>({ columns, rows, caption }: DataTableProps<T>) {
  return (
    <table className="data-table">
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={String(col.key)}>{String(row[col.key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
