import { useLocation } from 'react-router-dom';
import { NAV_SECTIONS } from '../data/navigation';

export default function Topbar() {
  const location = useLocation();

  // Build breadcrumb from current path
  const buildBreadcrumb = () => {
    if (location.pathname === '/') return [{ label: 'Dashboard' }];

    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        if (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) {
          return [
            { label: 'SAFV' },
            { label: section.label },
            { label: item.label },
          ];
        }
      }
    }
    return [{ label: 'SAFV' }];
  };

  const crumbs = buildBreadcrumb();

  return (
    <header className="topbar">
      {/* Breadcrumb */}
      <div className="topbar-breadcrumb">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        {crumbs.map((crumb, idx) => (
          <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {idx > 0 && <span className="crumb-sep">/</span>}
            <span className={idx === crumbs.length - 1 ? 'crumb-current' : ''}>{crumb.label}</span>
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="topbar-actions">
        {/* Notifications */}
        <button className="topbar-icon-btn" title="Notificaciones">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        {/* Settings */}
        <button className="topbar-icon-btn" title="Configuración">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M20 12h1.5M2.5 12H4M19.07 19.07l-1.41-1.41M5.34 5.34L3.93 3.93M12 20v1.5M12 2.5V4"/>
          </svg>
        </button>

        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Administrador</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>admin@safv.gob</div>
          </div>
          <div className="topbar-avatar">AD</div>
        </div>
      </div>
    </header>
  );
}
