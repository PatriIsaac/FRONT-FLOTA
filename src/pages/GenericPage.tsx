import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { DataTable } from '../components/ui/DataTable';
import { Plus, RefreshCw, Download, Search, AlertCircle } from 'lucide-react';

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

  const columns = [
    { key: 'id',          header: '#' },
    { key: 'descripcion', header: 'Descripción' },
    { key: 'estado',      header: 'Estado' },
    { key: 'fecha',       header: 'Fecha' },
  ];

  return (
    <div className="gp-root fade-in">

      {/* ── Page header ── */}
      <div className="gp-header">
        <div className="gp-header__icon" style={{ background: `${sectionColor}18`, color: sectionColor }}>
          <span style={{ fontSize: 22 }}>{sectionIcon}</span>
        </div>
        <div className="gp-header__text">
          <div className="gp-header__section" style={{ color: sectionColor }}>{section}</div>
          <h1 className="gp-header__title">
            {title}
            {code && <span className="gp-header__code">{code}</span>}
          </h1>
        </div>
      </div>

      <p className="gp-description">{description}</p>

      {/* ── Toolbar ── */}
      <div className="gp-toolbar">
        <div className="gp-toolbar__actions">
          <Button style={{ backgroundColor: sectionColor, borderColor: sectionColor }}>
            <Plus size={15} />
            Nuevo registro
          </Button>
          <Button variant="outline">
            <RefreshCw size={15} />
            Actualizar
          </Button>
          <Button variant="outline">
            <Download size={15} />
            Exportar
          </Button>
        </div>
        <div className="gp-toolbar__search">
          <Search className="gp-toolbar__search-icon" size={15} />
          <Input placeholder="Buscar..." className="gp-toolbar__search-input" />
        </div>
      </div>

      {/* ── Info notice ── */}
      <div className="gp-notice">
        <AlertCircle size={18} className="gp-notice__icon" />
        <div>
          <h3 className="gp-notice__title">Módulo en construcción</h3>
          <p className="gp-notice__body">
            Esta pantalla es un prototipo visual. Las funciones específicas de este módulo serán implementadas en la siguiente fase de desarrollo.
          </p>
        </div>
      </div>

      {/* ── Records table ── */}
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CardTitle>Registros</CardTitle>
            <span className="gp-count-badge">0 registros</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={[]}
            emptyMessage={`Comienza agregando un nuevo registro con el botón "Nuevo registro"`}
          />
        </CardContent>
      </Card>

      {/* ── Form prototype ── */}
      <Card>
        <CardHeader>
          <CardTitle>Formulario de registro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="gp-form-grid">
            <Input label="Campo 1" placeholder="Ingrese valor..." />
            <Input label="Campo 2" placeholder="Ingrese valor..." />
            <Select
              label="Campo 3"
              options={[{ value: '1', label: 'Opción 1' }]}
            />
            <Input label="Fecha" type="date" />
          </div>
          <div className="gp-form-actions">
            <Button style={{ backgroundColor: sectionColor, borderColor: sectionColor }}>Guardar</Button>
            <Button variant="outline" onClick={() => navigate(-1)}>Volver</Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
