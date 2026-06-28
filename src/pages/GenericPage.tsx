import { useNavigate } from 'react-router-dom';

interface PageProps {
  title: string;
  code?: string;
  description: string;
  section: string;
  sectionColor: string;
  sectionIcon: string;
}

export default function GenericPage({ title, code, description, section, sectionColor, sectionIcon }: PageProps) {
  const navigate = useNavigate();

  return (
    <div className="fade-in">
      {/* Page header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: sectionColor + '20',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
          }}>
            {sectionIcon}
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: sectionColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {section}
            </div>
            <h1 className="page-title" style={{ fontSize: '18px', marginTop: '1px' }}>
              {title}
              {code && <span className="page-badge">{code}</span>}
            </h1>
          </div>
        </div>
        <p className="page-subtitle" style={{ maxWidth: '600px', marginLeft: '46px' }}>
          {description}
        </p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" style={{ background: sectionColor }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nuevo registro
        </button>
        <button className="btn btn-outline">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-.57-4.49"/>
          </svg>
          Actualizar
        </button>
        <button className="btn btn-outline">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Exportar
        </button>
        <div style={{ flex: 1 }} />
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <svg
            width="14" height="14"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="form-control"
            placeholder="Buscar..."
            style={{ paddingLeft: '32px', width: '220px' }}
          />
        </div>
      </div>

      {/* Content placeholder */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Registros</span>
          <span className="badge badge-gray">0 registros</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5}>
                    <div style={{
                      textAlign: 'center', padding: '48px 20px',
                      color: 'var(--text-muted)', fontSize: '13px'
                    }}>
                      <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.4 }}>{sectionIcon}</div>
                      <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        Sin registros disponibles
                      </div>
                      <div>Comienza agregando un nuevo registro con el botón "Nuevo registro"</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form section */}
      <div className="card" style={{ marginTop: '16px' }}>
        <div className="card-header">
          <span className="card-title">Formulario de registro</span>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Campo 1</label>
              <input className="form-control" placeholder="Ingrese valor..." />
            </div>
            <div className="form-group">
              <label className="form-label">Campo 2</label>
              <input className="form-control" placeholder="Ingrese valor..." />
            </div>
            <div className="form-group">
              <label className="form-label">Campo 3</label>
              <select className="form-control">
                <option value="">Seleccionar...</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input className="form-control" type="date" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button className="btn btn-primary" style={{ background: sectionColor }}>Guardar</button>
            <button className="btn btn-outline" onClick={() => navigate(-1)}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
