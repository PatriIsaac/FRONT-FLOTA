import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_SECTIONS } from '../data/navigation';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => {
      // Auto-open the active section
      const active = NAV_SECTIONS.find(s =>
        s.items.some(i => location.pathname.startsWith(i.path))
      );
      return new Set(active ? [active.id] : [NAV_SECTIONS[0].id]);
    }
  );

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isItemActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="2"/>
            <path d="M16 8h4l3 5v3h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <div className="sidebar-logo-text">
          <div className="sidebar-logo-title">SAFV</div>
          <div className="sidebar-logo-subtitle">Administración de Flotas</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Dashboard link */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar-section-header${isActive ? ' active' : ''}`
          }
          style={{ textDecoration: 'none', marginBottom: '4px' }}
        >
          <div className="sidebar-section-icon" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <span className="sidebar-section-label">Dashboard</span>
        </NavLink>

        {/* Sections */}
        {NAV_SECTIONS.map(section => {
          const userRole = user?.role || user?.rol;
          if (section.allowedRoles && userRole && !section.allowedRoles.includes(userRole)) {
            return null;
          }
          
          const isOpen = openSections.has(section.id);
          const isSectionActive = section.items.some(i => isItemActive(i.path));

          return (
            <div
              key={section.id}
              className={`sidebar-section${isOpen ? ' open' : ''}`}
            >
              <div
                className={`sidebar-section-header${isSectionActive ? ' active' : ''}`}
                onClick={() => toggleSection(section.id)}
                title={collapsed ? section.label : undefined}
              >
                <div
                  className="sidebar-section-icon"
                  style={{ background: `${section.color}22` }}
                >
                  <span style={{ fontSize: '15px' }}>{section.icon}</span>
                </div>
                <span className="sidebar-section-label">{section.label}</span>
                <svg
                  className="sidebar-chevron"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              <div className="sidebar-items">
                {section.items.map(item => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-item${isActive ? ' active' : ''}`
                    }
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="sidebar-item-dot" />
                    <div style={{ flex: 1 }}>
                      <div className="sidebar-item-text">{item.label}</div>
                      {item.code && (
                        <div className="sidebar-item-code">{item.code}</div>
                      )}
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Toggle */}
      <div className="sidebar-toggle">
        <button className="sidebar-toggle-btn" onClick={onToggle} title={collapsed ? 'Expandir' : 'Colapsar'}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}
          >
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}
