import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'HomeTest',
    component: () => import('../views/HomeTest.vue'),
    children: [
      // {
      //   path: 'searchResult',
      //   name: 'SearchResult',
      //   component: () => import('../components/PopularSection.vue')
      // }
      // {
      //   path: '/defaultResult',
      //   name: 'DefaultResult',
      //   component: () => import('../components/DefaultResult.vue')
      // }
    ]
  },
  {
    path: '/:id',
    name: 'RouteTest',
    component: () => import('../views/RouteTest.vue'),
    props: true
  },
  {
    path: '/searchResult',
    name: 'SearchResult',
    component: () => import('../views/SearchResult.vue')
    // component: () => import('../components/PopularSection.vue')
  },
  {
    path: '/moreResult',
    name: 'MoreResult',
    component: () => import('../views/MoreResult.vue')
  },
  {
    path: '/cardDetail',
    name: 'CardDetail',
    component: () => import('../views/CardDetailTest.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
