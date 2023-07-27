import { createRouter, createWebHistory } from 'vue-router';
import {usePannelLayoutStore} from '@/store/layout/pannelLayout';


const routes = [
  {
    path: '/',
    component: () => import('@/layouts/simple/Simple.vue'),
    children: [
      {
        path: '/',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        meta: {pageTitle: 'Dashboard',},
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/pannel/Pannel.vue'),
    children: [
      {
        path: '/button-component',
        name: 'buttonComponent',
        component: () => import('@/pages/components/BtnBox.vue'),
        meta: {pageTitle: 'Button Component',},
      },
    ],
  },
  
  {
    path: '/',
    component: () => import('@/layouts/message/Message.vue'),
    children: [
      {
        path: '/500',
        name: '500',
        component: () => import('@/pages/messages/Message-500.vue'),
        meta: {pageTitle: '500',}
      },
      {
        path: '/503',
        name: '503',
        component: () => import('@/pages/messages/Message-503.vue'),
        meta: {pageTitle: '503',}
      },
      {
        path: '/504',
        name: '504',
        component: () => import('@/pages/messages/Message-504.vue'),
        meta: {pageTitle: '504',}
      },
      {
        path: '/401',
        name: '401',
        component: () => import('@/pages/messages/Message-401.vue'),
        meta: {pageTitle: '401',}
      },
      {
        path: '/403',
        name: '403',
        component: () => import('@/pages/messages/Message-403.vue'),
        meta: {pageTitle: '403',}
      },
      {
        path: '/419',
        name: '419',
        component: () => import('@/pages/messages/Message-419.vue'),
        meta: {pageTitle: '419',}
      },
      {
        path: '/429',
        name: '429',
        component: () => import('@/pages/messages/Message-429.vue'),
        meta: {pageTitle: '429',}
      },
      {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/pages/messages/Message-404.vue'),
        meta: {pageTitle: '404',}
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  //Remove visiable menu options.
  let menuOptionEl = document.getElementsByClassName('menu--options');
  for(let item of menuOptionEl){item.remove();}

  //Top loading bar
  let pannelLayout = usePannelLayoutStore();
  pannelLayout.activeRoute = to.name;

  if(!to.meta.source || !from.meta.source || to.meta.source != from.meta.source){
    //Top loading bar
    let el = document.getElementById('js-lazyloading-animation');
    el.style.transition = 'all 3s';
    el.style.width = '90%';
    //-------------End
  }
  //-------------End
  next();
});

router.afterEach((to, from) => {
  if(!to.meta.source || !from.meta.source || to.meta.source != from.meta.source){
    //Top loading bar
    let el = document.getElementById('js-lazyloading-animation');
    el.style.transition = 'all 0s';

    let parentEl = document.getElementById('js-lazyloading-animation-parent');
    parentEl.style.backgroundColor = 'var(--primary)'
    setTimeout(()=>{
      el.style.width = '0%';
      parentEl.style.backgroundColor = 'transparent';
    },300);
    //-------------End
  }
  
  document.getElementsByClassName('initial-loader-animation')[0].style.display = 'none';
});

router.backHandler = true;

export default router
