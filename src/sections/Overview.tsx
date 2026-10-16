import { StatCard } from '../components/StatCard/StatCard';
import { appointments, staff, services, clients } from '../data/mockData';

export function Overview() {
  return (
    <div className="section-overview" style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
      <StatCard label="Appointments Today" value={appointments.length} />
      <StatCard label="Staff" value={staff.length} />
      <StatCard label="Services" value={services.length} />
      <StatCard label="Clients" value={clients.length} />
    </div>
  );
}
