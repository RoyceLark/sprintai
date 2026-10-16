import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('shows the Overview section by default with stat cards', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Appointments Today')).toBeInTheDocument();
  });

  it('navigates to Appointments section when the nav link is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Appointments' }));
    expect(screen.getByRole('heading', { name: 'Appointments' })).toBeInTheDocument();
    expect(screen.getByText("Today's appointments")).toBeInTheDocument();
  });

  it('navigates to Staff, Services and Clients sections', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Staff' }));
    expect(screen.getByText('Staff', { selector: 'caption' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Services' }));
    expect(screen.getByText('Services', { selector: 'caption' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Clients' }));
    expect(screen.getByText('Clients', { selector: 'caption' })).toBeInTheDocument();
  });

  it('toggles the mobile navigation menu when the menu button is clicked', () => {
    render(<App />);
    const toggle = screen.getByRole('button', { name: 'Toggle navigation menu' });
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(nav.className).not.toContain('sidebar-open');

    fireEvent.click(toggle);
    expect(nav.className).toContain('sidebar-open');
  });
});
