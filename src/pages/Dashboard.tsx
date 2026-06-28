import { useNavigate } from 'react-router-dom';
import { NAV_SECTIONS } from '../data/navigation';

const sectionColors: Record<string, { bg: string; text: string }> = {
  seguridad:     { bg: 'rgba(99,102,241,0.1)',  text: '#6366f1' },
  configuracion: { bg: 'rgba(139,92,246,0.1)',  text: '#8b5cf6' },
  operacion:     { bg: 'rgba(14,165,233,0.1)',  text: '#0ea5e9' },
  abastecimiento:{ bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b' },
  mantenimiento: { bg: 'rgba(16,185,129,0.1)',  text: '#10b981' },
  costos:        { bg: 'rgba(239,68,68,0.1)',   text: '#ef4444' },
  administrativa:{ bg: 'rgba(100,116,139,0.1)', text: '#64748b' },
  inventario:    { bg: 'rgba(6,182,212,0.1)',   text: '#06b6d4' },
};

const stats = [
  { label: 'Vehículos activos', value: '48', icon: '🚛', change: '+2', up: true, color: '#0ea5e9' },
  { label: 'Conductores', value: '62', icon: '👤', change: '0', up: true, color: '#8b5cf6' },
  { label: 'Km este mes', value: '18,430', icon: '📍', change: '+12%', up: true, color: '#10b981' },
  { label: 'Órdenes activas', value: '7', icon: '🔧', change: '-3', up: false, color: '#f59e0b' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fade-in">
      {/* Welcome banner */}
      <div className="welcome-banner">
        <div className="welcome-title">
          Sistema de Administración de Flotas Vehiculares
        </div>
        <div className="welcome-sub">
          {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} · Bienvenido, Administrador
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon" style={{ background: s.color + '18' }}>
              <span style={{ fontSize: '20px' }}>{s.icon}</span>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-change ${s.up ? 'up' : 'down'}`}>
              {s.up ? '▲' : '▼'} {s.change} este mes
            </div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Módulos del sistema
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Selecciona un módulo para acceder a sus funcionalidades
        </p>
      </div>

      <div className="modules-grid">
        {NAV_SECTIONS.map(section => {
          const colors = sectionColors[section.id] ?? { bg: 'rgba(100,116,139,0.1)', text: '#64748b' };
          return (
            <div
              className="module-card"
              key={section.id}
              onClick={() => navigate(section.items[0].path)}
            >
              <div className="module-card-top">
                <div className="module-card-icon" style={{ background: colors.bg }}>
                  <span>{section.icon}</span>
                </div>
                <div>
                  <div className="module-card-title" style={{ color: colors.text }}>
                    {section.label}
                  </div>
                  <div className="module-card-count">
                    {section.items.length} funcionalidades
                  </div>
                </div>
              </div>
              <div className="module-card-desc">
                {section.items.slice(0, 3).map(i => i.label).join(' · ')}
                {section.items.length > 3 && ` · +${section.items.length - 3} más`}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: colors.text, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Acceder
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick access recent activity */}
      <div className="card" style={{ marginTop: '8px' }}>
        <div className="card-header">
          <span className="card-title">Actividad reciente</span>
          <button className="btn btn-outline btn-sm">Ver todo</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Módulo</th>
                  <th>Usuario</th>
                  <th>Fecha/Hora</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { evento: 'Movimiento diario registrado', modulo: 'Operación de Flota', usuario: 'J. Quispe', fecha: 'Hoy 08:42', estado: 'success' },
                  { evento: 'Orden de servicio emitida', modulo: 'Mantenimiento', usuario: 'M. Torres', fecha: 'Hoy 07:15', estado: 'info' },
                  { evento: 'Abastecimiento registrado', modulo: 'Abastecimiento', usuario: 'R. Mamani', fecha: 'Ayer 17:30', estado: 'success' },
                  { evento: 'Nuevo conductor registrado', modulo: 'Configuración', usuario: 'Admin', fecha: 'Ayer 14:00', estado: 'success' },
                  { evento: 'Reporte mensual generado', modulo: 'Costos e Indicadores', usuario: 'L. García', fecha: '27 Jun', estado: 'warning' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{row.evento}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{row.modulo}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{row.usuario}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{row.fecha}</td>
                    <td>
                      <span className={`badge badge-${row.estado}`}>
                        {row.estado === 'success' ? 'Completado' : row.estado === 'info' ? 'En proceso' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
