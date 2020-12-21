export default [
  {
    path: '/dashboard',
    exact: true,
    component: () => import('../components/dashboard/index'),
    seo: {
      title: 'Dashboard',
    },
  },
  {
    path: '/timetrack',
    exact: true,
    component: () => import('../components/timetrack-dashboard'),
    seo: {
      title: 'Timetrack',
    },
  },
];
