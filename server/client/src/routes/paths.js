// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  // newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: '/',
  general: {
    app: '/admin/app',
  },
  user: {
    root: '/user',
    new: '/admin/user/new',
    list: '/admin/user/list',
    account: '/admin/user/account',
    edit: (id) => `/admin/user/${id}/edit`,
  },
  client: {
    root: '/client',
    new: '/admin/client/new',
    list: '/admin/client/list',
    account: '/admin/client/account',
    edit: (id) => `/admin/client/${id}/edit`,
    // ZONE
    zoneNew: '/admin/client/zone/new',
    zoneEdit: (id) => `/admin/client/zone/${id}/edit`,
    zoneList: '/admin/client/zone/list',
  },
  adjustments: {
    root: '/admin/adjustments',
  },
  visit: {
    root: '/admin/visit/',
  },
  sales: {
    root: '/admin/sales',
    list: '/admin/sales/list',
    edit: (saleId) => `/admin/sales/${saleId}/edit`,
    sale: (saleId) => `/admin/sales/${saleId}/return`,
    return: '/admin/sales/sale-returns'
  },
  eCommerce: {
    root: '/products',
    list: '/admin/products/list',
    new: '/admin/products/new',
    edit: (name) => `/admin/products/${name}/edit`,
    // Categories
    categoryList: '/admin/products/category/list',
    categoryNew: '/admin/products/category/new',
    categoryEdit: (name) => `/admin/products/category/${name}/edit`,
    // Units
    unitList: '/admin/products/unit/list',
    unitNew: '/admin/products/unit/new',
    unitEdit: (name) => `/admin/products/unit/${name}/edit`,
    // Stock Alert
    stockAlertList: '/admin/products/stockAlert',
  },
};

export const AGENT_PATHS = {
  root: '/agent/app',
  general: {
    app: '/agent/app',
  },
  user: {
    root: '/user',
    account: '/agent/user/account',
  },
  visit: {
    root: '/visit',
    list: '/agent/visit/list',
    create: '/agent/visit/create',
    sale: (visitId) => `/agent/visit/${visitId}/sale`,
  },
  sale: {
    root: '/visit',
    list: '/agent/sale/list',
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
