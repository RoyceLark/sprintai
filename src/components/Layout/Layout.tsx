import { type ReactNode, useState } from 'react';
import { Sidebar, type NavItem } from '../Sidebar/Sidebar';
import { Button } from '../Button/Button';
import './Layout.css';

interface LayoutProps {
  active: NavItem;
  onSelect: (item: NavItem) => void;
  children: ReactNode;
}

export function Layout({ active, onSelect, children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar active={active} onSelect={onSelect} isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="layout-main">
        <header className="layout-header">
          <Button
            variant="secondary"
            className="layout-menu-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </Button>
          <h1 className="layout-title">{active}</h1>
        </header>
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
}
