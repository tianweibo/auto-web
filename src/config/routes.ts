export default [
  {
    exact: true,
    name: 'login',
    path: '/login',
    component: '@/pages/login/index',
  },
  {
    exact: true,
    name: 'reportView',
    path: 'reportView',
    component: '@/pages/reportView/index',
  },
  {
    exact: true,
    name: 'seeReport',
    path: 'seeReport',
    component: '@/pages/seeReport/index',
  },
  {
    exact: true,
    name: 'seeCode',
    path: 'seecode',
    component: '@/pages/seeCode/index',
  },
  {
    exact: false,
    path: '/',
    // 鉴权
    wrappers: ['@/components/auth'],
    component: '@/components/layouts',
    routes: [
      {
        exact: true,
        name: 'event',
        path: '/event',
        component: '@/pages/event/index',
      },
      {
        exact: true,
        name: 'app',
        path: '/app',
        component: '@/pages/application/index',
      },
      {
        exact: true,
        name: 'indicator',
        path: '/indicator',
        component: '@/pages/indicator/index',
      },
      {
        exact: true,
        name: 'user',
        path: '/user',
        component: '@/pages/user/index',
      },
      {
        exact: true,
        name: 'productLine',
        path: '/productline',
        component: '@/pages/productLine/index',
      },
      {
        exact: true,
        name: 'label',
        path: '/label',
        component: '@/pages/label/index',
      },
      {
        exact: true,
        name: 'tag',
        path: '/tag',
        component: '@/pages/tag/index',
      },
      {
        exact: true,
        name: 'project',
        path: '/project',
        component: '@/pages/project/index',
      },
      {
        exact: true,
        name: 'activity',
        path: '/activity',
        component: '@/pages/activity/index',
      },
      {
        exact: true,
        name: 'report',
        path: '/report',
        component: '@/pages/report/index',
      },
      {
        exact: true,
        name: 'reportCreate',
        path: '/report/create',
        component: '@/pages/report/subpages/create/index',
      },
    ],
  },
];
