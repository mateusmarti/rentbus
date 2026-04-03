import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/DashboardView.vue'
import ClientDashboardView from '../views/ClientDashboardView.vue'
import CompanyDashboardView from '../views/CompanyDashboardView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import PaymentCheckoutView from '../views/PaymentCheckoutView.vue'
import PaymentReceiptView from '../views/PaymentReceiptView.vue'

type UserRole = 'client' | 'company' | 'admin'

type StoredUser = {
  role?: UserRole
}

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    requiresAuth?: boolean
    role?: UserRole
  }
}

const routes: RouteRecordRaw[] = [
  { path: '/', component: LoginView, meta: { public: true } },
  { path: '/login', component: LoginView, meta: { public: true } },
  { path: '/register', component: RegisterView, meta: { public: true } },

  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/dashboard/client', component: ClientDashboardView, meta: { requiresAuth: true, role: 'client' } },
  { path: '/dashboard/company', component: CompanyDashboardView, meta: { requiresAuth: true, role: 'company' } },
  { path: '/dashboard/admin', component: AdminDashboardView, meta: { requiresAuth: true, role: 'admin' } },

  { path: '/payment/:tripId', component: PaymentCheckoutView, meta: { requiresAuth: true } },
  { path: '/payment/:tripId/receipt', component: PaymentReceiptView, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

function getStoredUser(): StoredUser | null {
  const userString = localStorage.getItem('user')

  if (!userString) {
    return null
  }

  try {
    return JSON.parse(userString) as StoredUser
  } catch (error) {
    console.error('Erro ao ler usuário do localStorage:', error)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    return null
  }
}

function getRedirectByRole(role?: UserRole): string {
  switch (role) {
    case 'client':
      return '/dashboard/client'
    case 'company':
      return '/dashboard/company'
    case 'admin':
      return '/dashboard/admin'
    default:
      return '/login'
  }
}

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const user = getStoredUser()

  if (to.meta.public) {
    if (token && user?.role) {
      return getRedirectByRole(user.role)
    }

    return true
  }

  if (to.meta.requiresAuth && (!token || !user?.role)) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return '/login'
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    return getRedirectByRole(user?.role)
  }

  return true
})

export default router