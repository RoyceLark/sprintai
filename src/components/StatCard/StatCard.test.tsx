import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('renders the label and value', () => {
    render(<StatCard label="Clients" value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Clients')).toBeInTheDocument();
  });
});
