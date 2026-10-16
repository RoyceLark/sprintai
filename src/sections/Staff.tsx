import { DataTable } from '../components/DataTable/DataTable';
import { staff, type Staff as StaffMember } from '../data/mockData';

const columns: { key: keyof StaffMember; header: string }[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
];

export function Staff() {
  return <DataTable columns={columns} rows={staff} caption="Staff" />;
}
