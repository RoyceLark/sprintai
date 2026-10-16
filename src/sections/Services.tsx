import { DataTable } from '../components/DataTable/DataTable';
import { services, type Service } from '../data/mockData';

const columns: { key: keyof Service; header: string }[] = [
  { key: 'name', header: 'Service' },
  { key: 'durationMinutes', header: 'Duration (min)' },
  { key: 'price', header: 'Price ($)' },
];

export function Services() {
  return <DataTable columns={columns} rows={services} caption="Services" />;
}
