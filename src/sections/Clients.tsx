import { DataTable } from '../components/DataTable/DataTable';
import { clients, type Client } from '../data/mockData';

const columns: { key: keyof Client; header: string }[] = [
  { key: 'name', header: 'Name' },
  { key: 'phone', header: 'Phone' },
];

export function Clients() {
  return <DataTable columns={columns} rows={clients} caption="Clients" />;
}
