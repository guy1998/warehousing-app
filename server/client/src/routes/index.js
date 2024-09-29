import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import AgentDashboardLayout from '../layouts/dashboard/agentIndex';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
import SafeRoute from './SafeRoute';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/admin') || pathname.includes('/agent')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/auth/login" replace />,
    },
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <SafeRoute>
              <Login />
            </SafeRoute>
          ),
        },
        {
          path: 'new-password/:id/:token',
          element: <NewPassword />,
        },
        {
          path: 'reset-password',
          element: <ResetPassword />,
        },
      ],
    },

    // Dashboard Routes
    {
      path: 'admin',
      element: (
        <SafeRoute>
          <DashboardLayout />
        </SafeRoute>
      ),
      children: [
        { path: '', element: <Navigate to={'/admin/app'} replace />, index: true },
        { path: 'app', element: <GeneralApp /> },
        { path: 'adjustments', element: <AdjustmentsPage /> },
        { path: 'visit', element: <AdminVisitsPage /> },
        {
          path: 'sales',
          children: [
            { element: <Navigate to={'/admin/sales/list'} replace />, index: true },
            { path: 'list', element: <AdminSalesPage /> },
            { path: ':saleId/return', element: <CreateSaleReturn /> },
            { path: ':saleId/edit', element: <EditSalePage />},
            { path: 'sale-returns', element: <AdminSaleReturnPage /> },
          ],
        },
        {
          path: 'products',
          children: [
            { element: <Navigate to="/products/list" replace />, index: true },
            { path: 'list', element: <EcommerceProductList /> },
            { path: 'new', element: <EcommerceProductCreate /> },
            { path: ':name/edit', element: <EcommerceProductCreate /> },
            { path: 'category/list', element: <EcommerceCategoryList /> },
            { path: 'category/new', element: <EcommerceCategoryCreate /> },
            { path: 'category/:name/edit', element: <EcommerceCategoryCreate /> },
            { path: 'unit/list', element: <EcommerceUnitList /> },
            { path: 'unit/new', element: <EcommerceUnitCreate /> },
            { path: 'unit/:name/edit', element: <EcommerceUnitCreate /> },
            { path: 'stockAlert', element: <EcommerceStockAlertList /> },
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/admin/user/list" replace />, index: true },
            { path: 'list', element: <UserList /> },
            { path: 'new', element: <UserCreate /> },
            { path: ':id/edit', element: <UserCreate /> },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'client',
          children: [
            { element: <Navigate to="/admin/client/list" replace />, index: true },
            { path: 'list', element: <ClientList /> },
            { path: 'new', element: <ClientCreate /> },
            { path: ':id/edit', element: <ClientCreate /> },
            // { path: 'account', element: <ClientAccount /> },
            { path: 'zone/list', element: <ZoneList /> },
            { path: 'zone/new', element: <ZoneCreate /> },
            { path: 'zone/:name/edit', element: <ZoneCreate /> },
          ],
        },
      ],
    },

    {
      path: 'agent',
      element: (
        <SafeRoute>
          <AgentDashboardLayout />
        </SafeRoute>
      ),
      children: [
        { path: '', element: <Navigate to={'/agent/app'} replace />, index: true },

        // { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <AgentDashboard /> },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'account', element: <UserAccount /> },
          ],
        },
        {
          path: 'visit',
          children: [
            { element: <Navigate to="/agent/visit/list" replace />, index: true },
            { path: 'list', element: <AgentVisitsPage /> },
            { path: 'create', element: <CreateVisit /> },
            { path: ':visitId/sale', element: <SellingPage /> },
          ],
        },
        {
          path: 'sale',
          children: [
            { element: <Navigate to="/agent/sale/list" replace />, index: true },
            { path: 'list', element: <AgentSalesPage /> },
          ],
        },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },

    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')));

// DASHBOARD

// GENERAL
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const AgentDashboard = Loadable(lazy(() => import('../pages/dashboard/AgentDashboard')));

// ECOMMERCE
const EcommerceProductList = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductList')));
const EcommerceProductCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceProductCreate')));
const EcommerceCategoryList = Loadable(lazy(() => import('../pages/dashboard/EcommerceCategoryList')));
const EcommerceCategoryCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceCategoryCreate')));
const EcommerceUnitList = Loadable(lazy(() => import('../pages/dashboard/EcommerceUnitList')));
const EcommerceUnitCreate = Loadable(lazy(() => import('../pages/dashboard/EcommerceUnitCreate')));
const EcommerceStockAlertList = Loadable(lazy(() => import('../pages/dashboard/EcommerceStockAlertList')));

// USER
const UserList = Loadable(lazy(() => import('../pages/dashboard/UserList')));
const UserAccount = Loadable(lazy(() => import('../pages/dashboard/UserAccount')));
const UserCreate = Loadable(lazy(() => import('../pages/dashboard/UserCreate')));

// CLIENT
const ClientList = Loadable(lazy(() => import('../pages/dashboard/ClientList')));
const ClientCreate = Loadable(lazy(() => import('../pages/dashboard/ClientCreate')));

// ZONE
const ZoneList = Loadable(lazy(() => import('../pages/dashboard/ZoneList')));
const ZoneCreate = Loadable(lazy(() => import('../pages/dashboard/ZoneCreate')));

// MAIN
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));

// VISITS
const AgentVisitsPage = Loadable(lazy(() => import('../pages/AgentVisitsPage')));
const CreateVisit = Loadable(lazy(() => import('../pages/CreateVisit')));
const SellingPage = Loadable(lazy(() => import('../pages/SellingPage')));
const AdminVisitsPage = Loadable(lazy(() => import('../pages/AdminVisitsPage')));

// ADJUSTMENT
const AdjustmentsPage = Loadable(lazy(() => import('../pages/AdjustmentsPage')));

// SALES
const AgentSalesPage = Loadable(lazy(() => import('../pages/AgentSalesPage')));
const AdminSalesPage = Loadable(lazy(() => import('../pages/AdminSalesPage')));
const CreateSaleReturn = Loadable(lazy(() => import('../pages/CreateSaleReturn')));
const AdminSaleReturnPage = Loadable(lazy(() => import('../pages/AdminSaleReturnPage')));
const EditSalePage = Loadable(lazy(() => import('../pages/EditSalePage')));
