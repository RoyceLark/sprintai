import { DataTable } from '../components/DataTable/DataTable';
import { appointments, type Appointment } from '../data/mockData';

const columns: { key: keyof Appointment; header: string }[] = [
  { key: 'time', header: 'Time' },
  { key: 'client', header: 'Client' },
  { key: 'service', header: 'Service' },
  { key: 'stylist', header: 'Stylist' },
];

export function Appointments() {
  return <DataTable columns={columns} rows={appointments} caption="Today's appointments" />;
}
