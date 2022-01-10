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
    path: '/searchResult',
    name: 'SearchResult',
    component: () => import('../views/SearchResultTest.vue'),
    props: route => {
      console.log('route', route);
      return {
        inputKeywords: route.query.q,
        type: route.query.type,
        city: route.query.city
      };
    }
  },
  {
    path: '/moreResult',
    name: 'MoreResult',
    component: () => import('../views/MoreResultTest.vue')
  },
  {
    path: '/cardDetail',
    name: 'CardDetail',
    component: () => import('../views/CardDetail.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/PageNotFound.vue')
  },
  {
    path: '/: pathMatch(.*)*',
    redirect: {
      name: '404'
      // /: pathMatch(.*)
    }
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
