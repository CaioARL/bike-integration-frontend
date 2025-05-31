import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/PublicMainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/HomePage.vue') }],
  },
  {
    path: '/home',
    component: () => import('src/layouts/PublicMainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/HomePage.vue') }],
  },
  /* PUBLIC */
  {
    path: '/login',
    component: () => import('src/layouts/PublicMainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/HomePage.vue') }],
  },
  {
    path: '/acesso-negado',
    component: () => import('src/layouts/PublicMainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/AccessDeniedPage.vue') }],
  },
  {
    path: '/servico-indisponivel',
    component: () => import('src/layouts/PublicMainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/NetworkErrorPage.vue') }],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/NotFoundPage.vue'),
  },
];

export default routes;
