import { createRouter, createWebHistory } from 'vue-router';
import {usePanelLayoutStore} from '@/store/layout/panelLayout';


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
      {
        path: '/login',
        name: 'login',
        component: () => import('@/pages/auth/Login.vue'),
        meta: {pageTitle: 'Log in',},
      },
      {
        path: '/reset-password-request',
        name: 'resetPasswordRequest',
        component: () => import('@/pages/auth/ResetPasswordRequest.vue'),
        meta: {pageTitle: 'Reset Password Request',},
      },
      {
        path: '/password-expired',
        name: 'passwordExpired',
        component: () => import('@/pages/auth/PasswordExpired.vue'),
        meta: {pageTitle: 'Password Expired',},
      },
      {
        path: '/change-password',
        name: 'changePassword',
        component: () => import('@/pages/auth/ChangePassword.vue'),
        meta: {pageTitle: 'Change Password',},
      },
      {
        path: '/reset-password',
        name: 'resetPassword',
        component: () => import('@/pages/auth/ResetPassword.vue'),
        meta: {pageTitle: 'Reset Password',},
      },
      {
        path: '/two-factor-authentication',
        name: 'twoFactorAuthentication',
        component: () => import('@/pages/auth/TwoFactorAuthentication.vue'),
        meta: {pageTitle: 'Two Factor Authentication',},
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/panel/Panel.vue'),
    children: [
      {
        path: '/button-component',
        name: 'buttonComponent',
        component: () => import('@/pages/components/BtnBox.vue'),
        meta: {pageTitle: 'Button Component',},
      },

      {
        path: '/datepicker-component',
        name: 'datePicker',
        component: () => import('@/pages/components/DatePicker.vue'),
        meta: {pageTitle: 'Button Component',},
      },
      {
        path: '/inputbox-component',
        name: 'inputBoxComponent',
        component: () => import('@/pages/components/InputBox.vue'),
        meta: {pageTitle: 'InputBox Component',},
      },
      {
        path: '/MessageBox-component',
        name: 'messageBoxComponent',
        component: () => import('@/pages/components/MessageBox.vue'),
        meta: {pageTitle: 'Message Box Component',},
      },
      {
        path: '/select-box-component',
        name: 'selectBoxComponent',
        component: () => import('@/pages/components/SelectBox.vue'),
        meta: {pageTitle: 'Select Box Component',},
      },
      {
        path: '/menu-component',
        name: 'menuComponent',
        component: () => import('@/pages/components/Menu.vue'),
        meta: {pageTitle: 'Menu Component',},
      },
      {
        path: '/otp-input-component',
        name: 'otpInput',
        component: () => import('@/pages/components/OTPInput.vue'),
        meta: {pageTitle: 'Menu Component',},
      },
      {
        path: '/checkbox-component',
        name: 'checkBoxComponent',
        component: () => import('@/pages/components/CheckBox.vue'),
        meta: {pageTitle: 'CheckBox Component',},
      },
      {
        path: '/radiobox-component',
        name: 'radioBoxComponent',
        component: () => import('@/pages/components/RadioBox.vue'),
        meta: {pageTitle: 'Radio Box Component',},
      },
      {
        path: '/table-component',
        name: 'dataTableComponent',
        component: () => import('@/pages/components/DataTable.vue'),
        meta: {pageTitle: 'Data Table Component',},
      },
      {
        path: '/modal-component',
        name: 'modalComponent',
        component: () => import('@/pages/components/Modal.vue'),
        meta: {pageTitle: 'Modal Component',},
      },
      {
        path: '/color-picker-component',
        name: 'colorPickerComponent',
        component: () => import('@/pages/components/ColorPicker.vue'),
        meta: {pageTitle: 'Color Picker Component',},
      },
      {
        path: '/stepper-component',
        name: 'stepperComponent',
        component: () => import('@/pages/components/Stepper.vue'),
        meta: {pageTitle: 'Stepper Component',},
      },
      {
        path: '/util-component',
        name: 'utilComponent',
        component: () => import('@/pages/components/Util.vue'),
        meta: {pageTitle: 'Util Component',},
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
  let panelLayout = usePanelLayoutStore();
  panelLayout.activeRoute = to.name;

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
