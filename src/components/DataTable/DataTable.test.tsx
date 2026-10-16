import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataTable } from './DataTable';

interface Row {
  id: string;
  name: string;
  value: number;
}

const columns = [
  { key: 'name' as const, header: 'Name' },
  { key: 'value' as const, header: 'Value' },
];

const rows: Row[] = [
  { id: '1', name: 'Alpha', value: 10 },
  { id: '2', name: 'Beta', value: 20 },
];

describe('DataTable', () => {
  it('renders headers and all rows', () => {
    render(<DataTable columns={columns} rows={rows} caption="My rows" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('My rows')).toBeInTheDocument();
  });

  it('renders no rows when given an empty array', () => {
    render(<DataTable columns={columns} rows={[]} />);
    expect(screen.queryByRole('row', { name: /Alpha/ })).not.toBeInTheDocument();
  });
});
