import { useNavigate } from 'react-router-dom';
import { NAV_SECTIONS } from '../data/navigation';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Truck, Users, MapPin, Wrench, TrendingUp, TrendingDown } from 'lucide-react';

const stats = [
  { label: 'Vehículos activos', value: '48', icon: Truck, change: '+2', up: true,
    iconBg: 'rgba(14,165,233,0.12)', iconColor: '#0ea5e9' },
  { label: 'Conductores', value: '62', icon: Users, change: '0', up: true,
    iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6' },
  { label: 'Km este mes', value: '18,430', icon: MapPin, change: '+12%', up: true,
    iconBg: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
  { label: 'Órdenes activas', value: '7', icon: Wrench, change: '-3', up: false,
    iconBg: 'rgba(245,158,11,0.12)', iconColor: '#f59e0b' },
];

const chartData = [
  { name: 'Ene', combustible: 4000, mantenimiento: 2400 },
  { name: 'Feb', combustible: 3000, mantenimiento: 1398 },
  { name: 'Mar', combustible: 2000, mantenimiento: 9800 },
  { name: 'Abr', combustible: 2780, mantenimiento: 3908 },
  { name: 'May', combustible: 1890, mantenimiento: 4800 },
  { name: 'Jun', combustible: 2390, mantenimiento: 3800 },
];

const recentActivity = [
  { evento: 'Movimiento diario registrado', modulo: 'Operación de Flota', usuario: 'J. Quispe', fecha: 'Hoy 08:42', estado: 'success' },
  { evento: 'Orden de servicio emitida', modulo: 'Mantenimiento', usuario: 'M. Torres', fecha: 'Hoy 07:15', estado: 'info' },
  { evento: 'Abastecimiento registrado', modulo: 'Abastecimiento', usuario: 'R. Mamani', fecha: 'Ayer 17:30', estado: 'success' },
  { evento: 'Nuevo conductor registrado', modulo: 'Configuración', usuario: 'Admin', fecha: 'Ayer 14:00', estado: 'success' },
  { evento: 'Reporte mensual generado', modulo: 'Costos e Indicadores', usuario: 'L. García', fecha: '27 Jun', estado: 'warning' },
];

// Section icon accent colors (theme-safe: only hue, not bg/text classes)
const sectionAccents: Record<string, string> = {
  seguridad:      '#6366f1',
  configuracion:  '#8b5cf6',
  operacion:      '#0ea5e9',
  abastecimiento: '#f59e0b',
  mantenimiento:  '#10b981',
  costos:         '#ef4444',
  administrativa: '#64748b',
  inventario:     '#06b6d4',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const columns = [
    { key: 'evento',  header: 'Evento' },
    { key: 'modulo',  header: 'Módulo' },
    { key: 'usuario', header: 'Usuario' },
    { key: 'fecha',   header: 'Fecha/Hora' },
    {
      key: 'estado',
      header: 'Estado',
      render: (item: any) => (
        <Badge variant={item.estado === 'success' ? 'success' : item.estado === 'info' ? 'info' : 'warning'}>
          {item.estado === 'success' ? 'Completado' : item.estado === 'info' ? 'En proceso' : 'Pendiente'}
        </Badge>
      )
    },
  ];

  return (
    <div className="dash-root fade-in">

      {/* ── Welcome Banner ── */}
      <div className="dash-welcome">
        <div>
          <h1 className="dash-welcome__title">
            Sistema de Administración de Flotas Vehiculares
          </h1>
          <p className="dash-welcome__sub">
            {dateStr.charAt(0).toUpperCase() + dateStr.slice(1)}
            &nbsp;·&nbsp;Bienvenido, <strong>{user?.name || 'Administrador'}</strong>
          </p>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="dash-stats">
        {stats.map((s, i) => (
          <div key={i} className="dash-stat">
            <div className="dash-stat__icon" style={{ background: s.iconBg }}>
              <s.icon size={22} style={{ color: s.iconColor }} />
            </div>
            <div className="dash-stat__body">
              <p className="dash-stat__label">{s.label}</p>
              <h3 className="dash-stat__value">{s.value}</h3>
              <span className={`dash-stat__change ${s.up ? 'dash-stat__change--up' : 'dash-stat__change--down'}`}>
                {s.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.change} este mes
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="dash-charts">
        <Card>
          <CardHeader>
            <CardTitle>Gastos: Combustible vs Mantenimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 10,
                      color: 'var(--text-primary)',
                      fontSize: 13,
                    }}
                  />
                  <Bar dataKey="combustible" fill="#3b82f6" name="Combustible (S/)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mantenimiento" fill="#10b981" name="Mantenimiento (S/)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Recorrido (km)</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 10,
                      color: 'var(--text-primary)',
                      fontSize: 13,
                    }}
                  />
                  <Line type="monotone" dataKey="combustible" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4, fill: '#8b5cf6' }} name="Kilómetros" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Modules ── */}
      <div className="dash-modules-section">
        <div className="dash-section-header">
          <h2 className="dash-section-title">Módulos del sistema</h2>
          <p className="dash-section-sub">Selecciona un módulo para acceder a sus funcionalidades</p>
        </div>

        <div className="dash-modules">
          {NAV_SECTIONS.map(section => {
            const accent = sectionAccents[section.id] ?? '#64748b';
            return (
              <div
                key={section.id}
                className="dash-module-card"
                onClick={() => navigate(section.items[0].path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(section.items[0].path)}
              >
                <div className="dash-module-card__top">
                  <div
                    className="dash-module-card__icon"
                    style={{ background: `${accent}18`, color: accent }}
                  >
                    <span style={{ fontSize: 20 }}>{section.icon}</span>
                  </div>
                  <div>
                    <h3 className="dash-module-card__name" style={{ color: accent }}>{section.label}</h3>
                    <p className="dash-module-card__count">{section.items.length} funcionalidades</p>
                  </div>
                </div>
                <p className="dash-module-card__desc">
                  {section.items.slice(0, 3).map(i => i.label).join(' · ')}
                  {section.items.length > 3 && ` · +${section.items.length - 3} más`}
                </p>
                <div className="dash-module-card__arrow" style={{ color: accent }}>
                  Acceder →
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle>Actividad reciente</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={recentActivity} />
        </CardContent>
      </Card>

    </div>
  );
}
