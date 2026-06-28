import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import GenericPage from '../pages/GenericPage';

// Helper to create a generic route element
const page = (
  title: string,
  description: string,
  section: string,
  sectionColor: string,
  sectionIcon: string,
  code?: string
) => (
  <GenericPage
    title={title}
    code={code}
    description={description}
    section={section}
    sectionColor={sectionColor}
    sectionIcon={sectionIcon}
  />
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },

      // ── Seguridad ──────────────────────────────────────────────────────────
      {
        path: 'seguridad/usuarios',
        element: page(
          'Mant. Usuarios',
          'Registro, modificación y desactivación de usuarios del sistema.',
          'Seguridad', '#6366f1', '🔐'
        ),
      },
      {
        path: 'seguridad/roles',
        element: page(
          'Mant. Roles',
          'Asociación de permisos por rol (RBAC): analista de costos, jefe de mantenimiento, encargado de garaje, conductor, gerencia, administrador.',
          'Seguridad', '#6366f1', '🔐'
        ),
      },

      // ── Configuración ──────────────────────────────────────────────────────
      {
        path: 'configuracion/vehiculos',
        element: page(
          'Mant. Vehículos',
          'Registro y codificación patrimonial de seis dígitos de las unidades de la flota.',
          'Configuración', '#8b5cf6', '⚙️'
        ),
      },
      {
        path: 'configuracion/conductores',
        element: page(
          'Mant. Conductores',
          'Registro de conductores y asignación vigente a vehículos.',
          'Configuración', '#8b5cf6', '⚙️'
        ),
      },
      {
        path: 'configuracion/areas',
        element: page(
          'Mant. Áreas',
          'Registro de áreas/dependencias para la asignación de vehículos.',
          'Configuración', '#8b5cf6', '⚙️'
        ),
      },
      {
        path: 'configuracion/talleres',
        element: page(
          'Mant. Talleres',
          'Registro de talleres propios y de terceros autorizados.',
          'Configuración', '#8b5cf6', '⚙️'
        ),
      },
      {
        path: 'configuracion/servicentros',
        element: page(
          'Mant. Servicentros',
          'Registro de servicentros acreditados para el abastecimiento de combustible.',
          'Configuración', '#8b5cf6', '⚙️'
        ),
      },
      {
        path: 'configuracion/parametros-costos',
        element: page(
          'Parámetros de costos (CFP/CFV)',
          'Ingreso manual o importación por archivo (CSV) del costo fijo provisto por Contabilidad de Costos.',
          'Configuración', '#8b5cf6', '⚙️'
        ),
      },

      // ── Operación de Flota ─────────────────────────────────────────────────
      {
        path: 'operacion/movimiento-diario',
        element: page(
          'Registrar movimiento diario',
          'Registro de salida, recorrido y llegada del vehículo; actualización del kilometraje acumulado.',
          'Operación de Flota', '#0ea5e9', '🚛', 'MA 122 01 01'
        ),
      },
      {
        path: 'operacion/asignar-vehiculo',
        element: page(
          'Asignar vehículo a área',
          'Asignación de unidades disponibles a las áreas solicitantes.',
          'Operación de Flota', '#0ea5e9', '🚛'
        ),
      },
      {
        path: 'operacion/disponibilidad',
        element: page(
          'Consultar disponibilidad',
          'Consulta del estado y disponibilidad operativa de cada unidad.',
          'Operación de Flota', '#0ea5e9', '🚛'
        ),
      },
      {
        path: 'operacion/calcular-iuv',
        element: page(
          'Calcular IUV',
          'Cálculo del índice de utilización del vehículo (Ec. 10).',
          'Operación de Flota', '#0ea5e9', '🚛'
        ),
      },
      {
        path: 'operacion/totalizar-km',
        element: page(
          'Totalizar km y horas mensuales',
          'Consolidación mensual de kilometraje y horas de uso para el cálculo de costos.',
          'Operación de Flota', '#0ea5e9', '🚛'
        ),
      },

      // ── Abastecimiento ─────────────────────────────────────────────────────
      {
        path: 'abastecimiento/emitir-orden',
        element: page(
          'Emitir orden de abastecimiento',
          'Autorización previa emitida por el encargado de garaje antes del abastecimiento.',
          'Abastecimiento', '#f59e0b', '⛽', 'MA 122 01 02'
        ),
      },
      {
        path: 'abastecimiento/registrar',
        element: page(
          'Registrar abastecimiento',
          'Registro de combustible/lubricante, galones y kilometraje del vehículo.',
          'Abastecimiento', '#f59e0b', '⛽'
        ),
      },
      {
        path: 'abastecimiento/calcular-rendimiento',
        element: page(
          'Calcular rendimiento (km/galón)',
          'Cálculo del rendimiento de combustible por unidad.',
          'Abastecimiento', '#f59e0b', '⛽'
        ),
      },
      {
        path: 'abastecimiento/totalizar-consumo',
        element: page(
          'Totalizar consumo mensual',
          'Consolidación mensual de galones consumidos y costo de combustible.',
          'Abastecimiento', '#f59e0b', '⛽'
        ),
      },

      // ── Mantenimiento ──────────────────────────────────────────────────────
      {
        path: 'mantenimiento/programar-preventivo',
        element: page(
          'Programar mantenimiento preventivo',
          'Programación por kilometraje a partir del movimiento acumulado de la unidad.',
          'Mantenimiento', '#10b981', '🔧'
        ),
      },
      {
        path: 'mantenimiento/orden-servicio',
        element: page(
          'Registrar orden de servicio',
          'Emisión de orden de servicio para mantenimiento en taller propio.',
          'Mantenimiento', '#10b981', '🔧', 'MA 122 02 01'
        ),
      },
      {
        path: 'mantenimiento/servicio-externo',
        element: page(
          'Autorizar servicio externo',
          'Autorización de servicio para mantenimiento en taller de terceros.',
          'Mantenimiento', '#10b981', '🔧', 'MA 122 02 02'
        ),
      },
      {
        path: 'mantenimiento/mano-obra-repuestos',
        element: page(
          'Registrar mano de obra y repuestos',
          'Registro de insumos, repuestos y horas de mano de obra utilizadas.',
          'Mantenimiento', '#10b981', '🔧', 'MA 122 02 04'
        ),
      },
      {
        path: 'mantenimiento/costo-mensual',
        element: page(
          'Registrar costo mensual',
          'Consolidación de los costos de mantenimiento del periodo.',
          'Mantenimiento', '#10b981', '🔧', 'MA 122 02 03'
        ),
      },
      {
        path: 'mantenimiento/historial-tecnico',
        element: page(
          'Consultar historial técnico',
          'Consulta del historial de intervenciones preventivas y correctivas por vehículo.',
          'Mantenimiento', '#10b981', '🔧'
        ),
      },

      // ── Costos e Indicadores ───────────────────────────────────────────────
      {
        path: 'costos/costo-variable',
        element: page(
          'Calcular costo variable y CKV',
          'Cálculo del costo variable del vehículo (CVV) y el costo por kilómetro (CKV) — Ec. 1.',
          'Costos e Indicadores', '#ef4444', '📊'
        ),
      },
      {
        path: 'costos/depreciacion',
        element: page(
          'Calcular depreciación lineal operacional',
          'Cálculo de la depreciación mensual operacional del vehículo — Ec. 2.',
          'Costos e Indicadores', '#ef4444', '📊'
        ),
      },
      {
        path: 'costos/costo-promedio',
        element: page(
          'Calcular costo promedio anual y sustitución óptima',
          'Cálculo del costo promedio anual (Cpa) y evaluación de la edad óptima de sustitución — Ec. 11.',
          'Costos e Indicadores', '#ef4444', '📊'
        ),
      },
      {
        path: 'costos/indicadores',
        element: page(
          'Generar indicadores (VA / IA)',
          'Generación de indicadores de consumo, mantenimiento en terceros e índice de utilización.',
          'Costos e Indicadores', '#ef4444', '📊'
        ),
      },
      {
        path: 'costos/importar-cfp',
        element: page(
          'Ingresar / importar CFP y CFV',
          'Carga manual o por archivo CSV del costo fijo provisto por Contabilidad de Costos.',
          'Costos e Indicadores', '#ef4444', '📊'
        ),
      },
      {
        path: 'costos/reportes',
        element: page(
          'Emitir reportes de gestión',
          'Generación del reporte de Control Mensual del Costo Operacional (MA 122 03 01) para Gerencia.',
          'Costos e Indicadores', '#ef4444', '📊', 'MA 122 03 01'
        ),
      },

      // ── Administrativa ─────────────────────────────────────────────────────
      {
        path: 'administrativa/solicitud-materiales',
        element: page(
          'Registrar solicitud de materiales',
          'Registro de la solicitud de materiales asociada a una orden de servicio de mantenimiento.',
          'Administrativa (apoyo)', '#64748b', '📋', 'MA 113 01 01'
        ),
      },
      {
        path: 'administrativa/controlar-materiales',
        element: page(
          'Controlar materiales del almacén',
          'Atención de solicitudes y descuento de materiales del almacén de mantenimiento.',
          'Administrativa (apoyo)', '#64748b', '📋'
        ),
      },
      {
        path: 'administrativa/documentacion-personal',
        element: page(
          'Gestionar documentación y personal',
          'Soporte documental básico del personal operativo y administrativo.',
          'Administrativa (apoyo)', '#64748b', '📋'
        ),
      },

      // ── Inventario y Componentes ───────────────────────────────────────────
      {
        path: 'inventario/inventario-fisico',
        element: page(
          'Registrar inventario físico de la flota',
          'Registro físico de las unidades que componen la flota vehicular.',
          'Inventario y Componentes (apoyo)', '#06b6d4', '📦'
        ),
      },
      {
        path: 'inventario/ficha-llanta',
        element: page(
          'Registrar ficha de llanta / conjunto',
          'Registro de componentes de alto valor con código único, dimensión/tipo y estado.',
          'Inventario y Componentes (apoyo)', '#06b6d4', '📦'
        ),
      },
      {
        path: 'inventario/estado-componentes',
        element: page(
          'Consultar estado de componentes',
          'Consulta del estado actual de llantas y conjuntos mayores (motor, caja de cambios).',
          'Inventario y Componentes (apoyo)', '#06b6d4', '📦'
        ),
      },
    ],
  },
]);
