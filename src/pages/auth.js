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
    path: '/news',
    exact: true,
    component: () => import('../components/news/index'),
    seo: {
      title: 'News',
    },
  },
  {
    path: '/timetrack',
    exact: true,
    component: () => import('../components/timetrack/index'),
    seo: {
      title: 'Timetrack',
    },
  },
  {
    path: '/deskStatus',
    exact: true,
    component: () => import('../components/desk-status/index'),
    seo: {
      title: 'Desk Status',
    },
  },
];
