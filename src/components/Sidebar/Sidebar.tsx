import './Sidebar.css';

export const NAV_ITEMS = ['Overview', 'Appointments', 'Staff', 'Services', 'Clients'] as const;
export type NavItem = (typeof NAV_ITEMS)[number];

interface SidebarProps {
  active: NavItem;
  onSelect: (item: NavItem) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ active, onSelect, isOpen, onClose }: SidebarProps) {
  return (
    <nav className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} aria-label="Main navigation">
      <div className="sidebar-brand">Salon Dashboard</div>
      <ul className="sidebar-list">
        {NAV_ITEMS.map((item) => (
          <li key={item}>
            <button
              className={`sidebar-link ${item === active ? 'sidebar-link-active' : ''}`}
              onClick={() => {
                onSelect(item);
                onClose();
              }}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
