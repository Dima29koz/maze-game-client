import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/rules',
      name: 'rules',
      component: () => import('../views/RulesView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/reset_password',
      name: 'reset_password',
      component: () => import('../views/ResetPasswordView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('../views/RegistrationView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/confirm_email',
      name: 'confirm_email',
      component: () => import('../views/ConfirmEmailView.vue')
    },
    {
      path: '/profile_settings',
      name: 'profile_settings',
      component: () => import('../views/UserProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/my_games',
      name: 'my_games',
      component: () => import('../views/GamesHistoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('../views/PlayView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

export default router
