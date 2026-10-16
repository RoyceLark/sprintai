import { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import type { NavItem } from './components/Sidebar/Sidebar';
import { Overview } from './sections/Overview';
import { Appointments } from './sections/Appointments';
import { Staff } from './sections/Staff';
import { Services } from './sections/Services';
import { Clients } from './sections/Clients';

const SECTIONS: Record<NavItem, () => JSX.Element> = {
  Overview,
  Appointments,
  Staff,
  Services,
  Clients,
};

export function App() {
  const [active, setActive] = useState<NavItem>('Overview');
  const Section = SECTIONS[active];

  return (
    <Layout active={active} onSelect={setActive}>
      <Section />
    </Layout>
  );
}
