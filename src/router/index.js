import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import PantryView from '../views/PantryView.vue'
import SuggestionsView from '../views/SuggestionsView.vue'
import RecipeDetailView from '../views/RecipeDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/suggestions' },
    { path: '/login', component: LoginView, meta: { guest: true } },
    { path: '/register', component: RegisterView, meta: { guest: true } },
    { path: '/pantry', component: PantryView, meta: { requiresAuth: true } },
    { path: '/suggestions', component: SuggestionsView, meta: { requiresAuth: true } },
    { path: '/recipes/:id', component: RecipeDetailView, props: true, meta: { requiresAuth: true } },
    { path: '/recipes/:id/cook', component: () => import('../views/CookModeView.vue'), meta: { requiresAuth: true, immersive: true } },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) return '/login'
  if (to.meta.guest && auth.token) return '/suggestions'
})

export default router
