import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Bell, Settings, User as UserIcon, Sun, Moon } from 'lucide-react';
import { NAV_SECTIONS } from '../data/navigation';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { alerts } from '../utils/alerts';

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    const confirmed = await alerts.confirm('Cerrar Sesión', '¿Estás seguro de que deseas salir del sistema?');
    if (confirmed) {
      logout();
      navigate('/login');
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div className="topbar-actions" ref={dropdownRef}>
        {/* Notifications */}
        <button className="topbar-icon-btn" title="Notificaciones" id="topbar-notifications-btn">
          <Bell size={16} />
        </button>

        {/* Settings */}
        <button className="topbar-icon-btn" title="Configuración" id="topbar-settings-btn">
          <Settings size={16} />
        </button>

        {/* Theme toggle */}
        <button
          id="topbar-theme-btn"
          className="topbar-icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User section */}
        <div
          className="topbar-user"
          onClick={() => setShowDropdown(!showDropdown)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setShowDropdown(!showDropdown)}
        >
          <div className="topbar-user-info">
            <div className="topbar-user-name">{user?.name || user?.nombre || 'Usuario'}</div>
            <div className="topbar-user-role">
              {(() => {
                const r = user?.role || user?.rol;
                return r === 'admin' ? 'Administrador' : (r || 'Invitado');
              })()}
            </div>
          </div>
          <div className="topbar-avatar">
            {(user?.name || user?.nombre)?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="topbar-dropdown">
            <button
              className="topbar-dropdown-item"
              onClick={() => { setShowDropdown(false); navigate('/perfil'); }}
            >
              <UserIcon size={15} />
              Mi Perfil
            </button>
            <div className="topbar-dropdown-sep" />
            <button
              className="topbar-dropdown-item topbar-dropdown-item--danger"
              onClick={handleLogout}
            >
              <LogOut size={15} />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
