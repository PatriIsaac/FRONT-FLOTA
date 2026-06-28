// Navigation schema - Sistema de Administración de Flotas Vehiculares

export interface NavItem {
  id: string;
  label: string;
  code?: string;
  path: string;
  description: string;
}

export interface NavSection {
  id: string;
  label: string;
  icon: string;
  color: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'seguridad',
    label: 'Seguridad',
    icon: '🔐',
    color: '#6366f1',
    items: [
      {
        id: 'mant-usuarios',
        label: 'Mant. Usuarios',
        path: '/seguridad/usuarios',
        description: 'Registro, modificación y desactivación de usuarios del sistema',
      },
      {
        id: 'mant-roles',
        label: 'Mant. Roles',
        path: '/seguridad/roles',
        description: 'Asociación de permisos por rol (RBAC); analista de costos, jefe de mantenimiento, encargado de garaje, conductor, gerencia, administrador',
      },
    ],
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: '⚙️',
    color: '#8b5cf6',
    items: [
      {
        id: 'mant-vehiculos',
        label: 'Mant. Vehículos',
        path: '/configuracion/vehiculos',
        description: 'Registro y codificación patrimonial de seis dígitos de las unidades de la flota',
      },
      {
        id: 'mant-conductores',
        label: 'Mant. Conductores',
        path: '/configuracion/conductores',
        description: 'Registro de conductores y asignación vigente a vehículos',
      },
      {
        id: 'mant-areas',
        label: 'Mant. Áreas',
        path: '/configuracion/areas',
        description: 'Registro de áreas/dependencias para la asignación de vehículos',
      },
      {
        id: 'mant-talleres',
        label: 'Mant. Talleres',
        path: '/configuracion/talleres',
        description: 'Registro de talleres propios y de terceros autorizados',
      },
      {
        id: 'mant-servicentros',
        label: 'Mant. Servicentros',
        path: '/configuracion/servicentros',
        description: 'Registro de servicentros acreditados para el abastecimiento de combustible',
      },
      {
        id: 'parametros-costos',
        label: 'Parámetros de costos (CFP/CFV)',
        path: '/configuracion/parametros-costos',
        description: 'Ingreso manual o importación por archivo (CSV) del costo fijo provisto por Contabilidad de Costos',
      },
    ],
  },
  {
    id: 'operacion',
    label: 'Operación de Flota',
    icon: '🚛',
    color: '#0ea5e9',
    items: [
      {
        id: 'movimiento-diario',
        label: 'Registrar movimiento diario',
        code: 'MA 122 01 01',
        path: '/operacion/movimiento-diario',
        description: 'Registro de salida, recorrido y llegada del vehículo; actualización del kilometraje acumulado',
      },
      {
        id: 'asignar-vehiculo',
        label: 'Asignar vehículo a área',
        path: '/operacion/asignar-vehiculo',
        description: 'Asignación de unidades disponibles a las áreas solicitantes',
      },
      {
        id: 'consultar-disponibilidad',
        label: 'Consultar disponibilidad',
        path: '/operacion/disponibilidad',
        description: 'Consulta del estado y disponibilidad operativa de cada unidad',
      },
      {
        id: 'calcular-iuv',
        label: 'Calcular IUV',
        path: '/operacion/calcular-iuv',
        description: 'Cálculo del índice de utilización del vehículo (Ec. 10)',
      },
      {
        id: 'totalizar-km',
        label: 'Totalizar km y horas mensuales',
        path: '/operacion/totalizar-km',
        description: 'Consolidación mensual de kilometraje y horas de uso para el cálculo de costos',
      },
    ],
  },
  {
    id: 'abastecimiento',
    label: 'Abastecimiento',
    icon: '⛽',
    color: '#f59e0b',
    items: [
      {
        id: 'emitir-orden-abastecimiento',
        label: 'Emitir orden de abastecimiento',
        code: 'MA 122 01 02',
        path: '/abastecimiento/emitir-orden',
        description: 'Autorización previa emitida por el encargado de garaje antes del abastecimiento',
      },
      {
        id: 'registrar-abastecimiento',
        label: 'Registrar abastecimiento',
        path: '/abastecimiento/registrar',
        description: 'Registro de combustible/lubricante, galones y kilometraje del vehículo',
      },
      {
        id: 'calcular-rendimiento',
        label: 'Calcular rendimiento (km/galón)',
        path: '/abastecimiento/calcular-rendimiento',
        description: 'Cálculo del rendimiento de combustible por unidad',
      },
      {
        id: 'totalizar-consumo',
        label: 'Totalizar consumo mensual',
        path: '/abastecimiento/totalizar-consumo',
        description: 'Consolidación mensual de galones consumidos y costo de combustible',
      },
    ],
  },
  {
    id: 'mantenimiento',
    label: 'Mantenimiento',
    icon: '🔧',
    color: '#10b981',
    items: [
      {
        id: 'programar-preventivo',
        label: 'Programar mantenimiento preventivo',
        path: '/mantenimiento/programar-preventivo',
        description: 'Programación por kilometraje a partir del movimiento acumulado de la unidad',
      },
      {
        id: 'registrar-orden-servicio',
        label: 'Registrar orden de servicio',
        code: 'MA 122 02 01',
        path: '/mantenimiento/orden-servicio',
        description: 'Emisión de orden de servicio para mantenimiento en taller propio',
      },
      {
        id: 'autorizar-servicio-externo',
        label: 'Autorizar servicio externo',
        code: 'MA 122 02 02',
        path: '/mantenimiento/servicio-externo',
        description: 'Autorización de servicio para mantenimiento en taller de terceros',
      },
      {
        id: 'registrar-mano-obra',
        label: 'Registrar mano de obra y repuestos',
        code: 'MA 122 02 04',
        path: '/mantenimiento/mano-obra-repuestos',
        description: 'Registro de insumos, repuestos y horas de mano de obra utilizadas',
      },
      {
        id: 'registrar-costo-mensual',
        label: 'Registrar costo mensual',
        code: 'MA 122 02 03',
        path: '/mantenimiento/costo-mensual',
        description: 'Consolidación de los costos de mantenimiento del periodo',
      },
      {
        id: 'historial-tecnico',
        label: 'Consultar historial técnico',
        path: '/mantenimiento/historial-tecnico',
        description: 'Consulta del historial de intervenciones preventivas y correctivas por vehículo',
      },
    ],
  },
  {
    id: 'costos',
    label: 'Costos e Indicadores',
    icon: '📊',
    color: '#ef4444',
    items: [
      {
        id: 'calcular-costo-variable',
        label: 'Calcular costo variable y CKV',
        path: '/costos/costo-variable',
        description: 'Cálculo del costo variable del vehículo (CVV) y el costo por kilómetro (CKV) — Ec. 1',
      },
      {
        id: 'calcular-depreciacion',
        label: 'Calcular depreciación lineal operacional',
        path: '/costos/depreciacion',
        description: 'Cálculo de la depreciación mensual operacional del vehículo — Ec. 2',
      },
      {
        id: 'calcular-costo-promedio',
        label: 'Calcular costo promedio anual y sustitución óptima',
        path: '/costos/costo-promedio',
        description: 'Cálculo del costo promedio anual (Cpa) y evaluación de la edad óptima de sustitución — Ec. 11',
      },
      {
        id: 'generar-indicadores',
        label: 'Generar indicadores (VA / IA)',
        path: '/costos/indicadores',
        description: 'Generación de indicadores de consumo, mantenimiento en terceros e índice de utilización',
      },
      {
        id: 'importar-cfp',
        label: 'Ingresar / importar CFP y CFV',
        path: '/costos/importar-cfp',
        description: 'Carga manual o por archivo CSV del costo fijo provisto por Contabilidad de Costos',
      },
      {
        id: 'emitir-reportes',
        label: 'Emitir reportes de gestión',
        code: 'MA 122 03 01',
        path: '/costos/reportes',
        description: 'Generación del reporte de Control Mensual del Costo Operacional para Gerencia',
      },
    ],
  },
  {
    id: 'administrativa',
    label: 'Administrativa (apoyo)',
    icon: '📋',
    color: '#64748b',
    items: [
      {
        id: 'solicitud-materiales',
        label: 'Registrar solicitud de materiales',
        code: 'MA 113 01 01',
        path: '/administrativa/solicitud-materiales',
        description: 'Registro de la solicitud de materiales asociada a una orden de servicio de mantenimiento',
      },
      {
        id: 'controlar-materiales',
        label: 'Controlar materiales del almacén',
        path: '/administrativa/controlar-materiales',
        description: 'Atención de solicitudes y descuento de materiales del almacén de mantenimiento',
      },
      {
        id: 'gestionar-documentacion',
        label: 'Gestionar documentación y personal',
        path: '/administrativa/documentacion-personal',
        description: 'Soporte documental básico del personal operativo y administrativo',
      },
    ],
  },
  {
    id: 'inventario',
    label: 'Inventario y Componentes (apoyo)',
    icon: '📦',
    color: '#06b6d4',
    items: [
      {
        id: 'inventario-fisico',
        label: 'Registrar inventario físico de la flota',
        path: '/inventario/inventario-fisico',
        description: 'Registro físico de las unidades que componen la flota vehicular',
      },
      {
        id: 'ficha-llanta',
        label: 'Registrar ficha de llanta / conjunto',
        path: '/inventario/ficha-llanta',
        description: 'Registro de componentes de alto valor con código único, dimensión/tipo y estado',
      },
      {
        id: 'estado-componentes',
        label: 'Consultar estado de componentes',
        path: '/inventario/estado-componentes',
        description: 'Consulta del estado actual de llantas y conjuntos mayores (motor, caja de cambios)',
      },
    ],
  },
];
