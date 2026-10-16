export interface Appointment {
  id: string;
  client: string;
  service: string;
  stylist: string;
  time: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
}

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
}

export const appointments: Appointment[] = [
  { id: 'a1', client: 'Jane Doe', service: 'Haircut', stylist: 'Amy Lee', time: '09:00' },
  { id: 'a2', client: 'Maria Rossi', service: 'Hair Coloring', stylist: 'Sam Kim', time: '10:30' },
  { id: 'a3', client: 'Chris Park', service: 'Beard Trim', stylist: 'Amy Lee', time: '12:00' },
];

export const staff: Staff[] = [
  { id: 's1', name: 'Amy Lee', role: 'Senior Stylist' },
  { id: 's2', name: 'Sam Kim', role: 'Colorist' },
  { id: 's3', name: 'Dana White', role: 'Receptionist' },
];

export const services: Service[] = [
  { id: 'sv1', name: 'Haircut', durationMinutes: 30, price: 35 },
  { id: 'sv2', name: 'Hair Coloring', durationMinutes: 90, price: 85 },
  { id: 'sv3', name: 'Beard Trim', durationMinutes: 15, price: 15 },
];

export const clients: Client[] = [
  { id: 'c1', name: 'Jane Doe', phone: '555-0101' },
  { id: 'c2', name: 'Maria Rossi', phone: '555-0102' },
  { id: 'c3', name: 'Chris Park', phone: '555-0103' },
];
