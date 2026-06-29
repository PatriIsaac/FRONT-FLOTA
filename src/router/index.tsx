import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import GenericPage from '../pages/GenericPage';
import Login from '../pages/auth/Login';

import PrivateRoute from './PrivateRoute';
import VehiculosList from '../pages/configuracion/Vehiculos/VehiculosList';
import ConductoresList from '../pages/configuracion/Conductores/ConductoresList';
import MovimientoList from '../pages/operacion/MovimientoDiario/MovimientoList';
import OrdenesList from '../pages/mantenimiento/OrdenesList';
import AbastecimientoList from '../pages/abastecimiento/AbastecimientoList';
import UsuariosList from '../pages/seguridad/Usuarios/UsuariosList';
import RolesList from '../pages/seguridad/Roles/RolesList';
import AreasList from '../pages/configuracion/Areas/AreasList';
import TalleresList from '../pages/configuracion/Talleres/TalleresList';
import ServicentrosList from '../pages/configuracion/Servicentros/ServicentrosList';
import ParametrosCostosList from '../pages/configuracion/ParametrosCostos/ParametrosCostosList';
import AsignacionList from '../pages/operacion/Asignacion/AsignacionList';
import DisponibilidadList from '../pages/operacion/Disponibilidad/DisponibilidadList';
import CalcularIUV from '../pages/operacion/Indicadores/CalcularIUV';
import TotalizarKmHoras from '../pages/operacion/Indicadores/TotalizarKmHoras';
import EmitirOrden from '../pages/abastecimiento/OrdenAbastecimiento/EmitirOrden';
import CalcularRendimiento from '../pages/abastecimiento/Indicadores/CalcularRendimiento';
import TotalizarConsumo from '../pages/abastecimiento/Indicadores/TotalizarConsumo';
import ProgramacionPreventivo from '../pages/mantenimiento/Programacion/ProgramacionPreventivo';
import AutorizacionServicio from '../pages/mantenimiento/ServicioExterno/AutorizacionServicio';
import RegistroManoObraRepuestos from '../pages/mantenimiento/RegistroTrabajos/RegistroManoObraRepuestos';
import RegistroCostoMensual from '../pages/mantenimiento/Costos/RegistroCostoMensual';
import HistorialTecnico from '../pages/mantenimiento/Historial/HistorialTecnico';
import CostoVariable from '../pages/costos/CostoVariable/CostoVariable';
import DepreciacionOperacional from '../pages/costos/Depreciacion/DepreciacionOperacional';
import CostoPromedioSustitucion from '../pages/costos/CostoPromedio/CostoPromedioSustitucion';
import GeneradorIndicadores from '../pages/costos/Indicadores/GeneradorIndicadores';
import ImportarCostosFijos from '../pages/costos/CostoFijo/ImportarCostosFijos';
import ReporteGestion from '../pages/costos/Reportes/ReporteGestion';
import SolicitudMateriales from '../pages/administrativa/SolicitudMateriales/SolicitudMateriales';
import ControlMateriales from '../pages/administrativa/ControlMateriales/ControlMateriales';
import DocumentacionPersonal from '../pages/administrativa/DocumentacionPersonal/DocumentacionPersonal';
import InventarioFisico from '../pages/inventario/InventarioFisico/InventarioFisico';
import FichaLlantaConjunto from '../pages/inventario/FichaLlanta/FichaLlantaConjunto';
import EstadoComponentes from '../pages/inventario/EstadoComponentes/EstadoComponentes';
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
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: <Dashboard /> },

      // ── Seguridad ──────────────────────────────────────────────────────────
      {
        path: 'seguridad/usuarios',
        element: <UsuariosList />,
      },
      {
        path: 'seguridad/roles',
        element: <RolesList />,
      },

      // ── Configuración ──────────────────────────────────────────────────────
      {
        path: 'configuracion/vehiculos',
        element: <VehiculosList />,
      },
      {
        path: 'configuracion/conductores',
        element: <ConductoresList />,
      },
      {
        path: 'configuracion/areas',
        element: <AreasList />,
      },
      {
        path: 'configuracion/talleres',
        element: <TalleresList />,
      },
      {
        path: 'configuracion/servicentros',
        element: <ServicentrosList />,
      },
      {
        path: 'configuracion/parametros-costos',
        element: <ParametrosCostosList />,
      },

      // ── Operación de Flota ─────────────────────────────────────────────────
      {
        path: 'operacion/movimiento-diario',
        element: <MovimientoList />,
      },
      {
        path: 'operacion/asignar-vehiculo',
        element: <AsignacionList />,
      },
      {
        path: 'operacion/disponibilidad',
        element: <DisponibilidadList />,
      },
      {
        path: 'operacion/calcular-iuv',
        element: <CalcularIUV />,
      },
      {
        path: 'operacion/totalizar-km',
        element: <TotalizarKmHoras />,
      },

      // ── Abastecimiento ─────────────────────────────────────────────────────
      {
        path: 'abastecimiento/emitir-orden',
        element: <EmitirOrden />,
      },
      {
        path: 'abastecimiento/registrar',
        element: <AbastecimientoList />,
      },
      {
        path: 'abastecimiento/calcular-rendimiento',
        element: <CalcularRendimiento />,
      },
      {
        path: 'abastecimiento/totalizar-consumo',
        element: <TotalizarConsumo />,
      },

      // ── Mantenimiento ──────────────────────────────────────────────────────
      {
        path: 'mantenimiento/programar-preventivo',
        element: <ProgramacionPreventivo />,
      },
      {
        path: 'mantenimiento/orden-servicio',
        element: <OrdenesList />,
      },
      {
        path: 'mantenimiento/servicio-externo',
        element: <AutorizacionServicio />,
      },
      {
        path: 'mantenimiento/mano-obra-repuestos',
        element: <RegistroManoObraRepuestos />,
      },
      {
        path: 'mantenimiento/costo-mensual',
        element: <RegistroCostoMensual />,
      },
      {
        path: 'mantenimiento/historial-tecnico',
        element: <HistorialTecnico />,
      },

      // ── Costos e Indicadores ───────────────────────────────────────────────
      {
        path: 'costos/costo-variable',
        element: <CostoVariable />,
      },
      {
        path: 'costos/depreciacion',
        element: <DepreciacionOperacional />,
      },
      {
        path: 'costos/costo-promedio',
        element: <CostoPromedioSustitucion />,
      },
      {
        path: 'costos/indicadores',
        element: <GeneradorIndicadores />,
      },
      {
        path: 'costos/importar-cfp',
        element: <ImportarCostosFijos />,
      },
      {
        path: 'costos/reportes',
        element: <ReporteGestion />,
      },

      // ── Administrativa ─────────────────────────────────────────────────────
      {
        path: 'administrativa/solicitud-materiales',
        element: <SolicitudMateriales />,
      },
      {
        path: 'administrativa/controlar-materiales',
        element: <ControlMateriales />,
      },
      {
        path: 'administrativa/documentacion-personal',
        element: <DocumentacionPersonal />,
      },

      // ── Inventario y Componentes ───────────────────────────────────────────
      {
        path: 'inventario/inventario-fisico',
        element: <InventarioFisico />,
      },
      {
        path: 'inventario/ficha-llanta',
        element: <FichaLlantaConjunto />,
      },
      {
        path: 'inventario/estado-componentes',
        element: <EstadoComponentes />,
      },
        ],
      },
    ],
  },
]);
