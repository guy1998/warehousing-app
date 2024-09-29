// routes
import { PATH_DASHBOARD, AGENT_PATHS } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
};

export const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },

      { title: 'adjustments', path: PATH_DASHBOARD.adjustments.root, icon: ICONS.invoice },
      // Products
      {
        title: 'Products',
        path: PATH_DASHBOARD.eCommerce.root,
        icon: ICONS.cart,
        children: [
          { title: 'products', path: PATH_DASHBOARD.eCommerce.list },
          { title: 'categories', path: PATH_DASHBOARD.eCommerce.categoryList },
          { title: 'units', path: PATH_DASHBOARD.eCommerce.unitList },
          { title: 'stock alert', path: PATH_DASHBOARD.eCommerce.stockAlertList },
        ],
      },
      // Visits
      {
        title: 'Visits',
        path: PATH_DASHBOARD.visit.root,
        icon: ICONS.calendar,
      },
      {
        title: 'Sales',
        path: PATH_DASHBOARD.sales.root,
        icon: ICONS.ecommerce,
        children: [
          { title: 'list', path: PATH_DASHBOARD.sales.list },
          { title: 'sale-returns', path: PATH_DASHBOARD.sales.return },
        ],
      },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'user',
        path: PATH_DASHBOARD.user.root,
        icon: ICONS.user,
        children: [
          { title: 'list', path: PATH_DASHBOARD.user.list },
          { title: 'account', path: PATH_DASHBOARD.user.account },
        ],
      },
      {
        title: 'clients',
        path: PATH_DASHBOARD.client.list,
        icon: ICONS.user,
        children: [
          { title: 'clients', path: PATH_DASHBOARD.client.list },
          { title: 'counties', path: PATH_DASHBOARD.client.zoneList },
        ],
      },
    ],
  },
];

export const agentNavConfig = [
  {
    subheader: 'general',
    items: [
      { title: 'dashboard', path: AGENT_PATHS.general.app, icon: ICONS.dashboard },
      {
        title: 'visits',
        path: AGENT_PATHS.visit.list,
        icon: ICONS.calendar,
      },
      {
        title: 'sales',
        path: AGENT_PATHS.sale.list,
        icon: ICONS.ecommerce,
      },
    ],
  },

  {
    subheader: 'management',
    items: [
      {
        title: 'user',
        path: AGENT_PATHS.user.root,
        icon: ICONS.user,
        children: [{ title: 'account', path: AGENT_PATHS.user.account }],
      },
    ],
  },
];
