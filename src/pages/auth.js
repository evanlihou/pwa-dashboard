export default [
  {
    path: '/dashboard',
    exact: true,
    component: () => import('../components/dashboard'),
    seo: {
      title: 'Dashboard',
    },
  },
];
