export default [
  {
    exact: true,
    name: 'login',
    path: '/login',
    component: '@/pages/login/index',
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
        name: 'user',
        path: '/user',
        component: '@/pages/user/index',
      },
      {
        exact: true,
        name: 'productLine',
        path: '/productline',
        component: '@/pages/productLine/index',
      }
    ],
  },
];
