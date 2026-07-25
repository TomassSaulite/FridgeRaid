<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
const auth = useAuthStore(); const router = useRouter()
async function logout() { await auth.logout(); router.push('/login') }
</script>
<template>
  <nav v-if="auth.token && !$route.meta.immersive" class="nav">
    <router-link to="/suggestions" class="nav__brand">fridge → dinner</router-link>
    <div class="nav__links"><router-link to="/pantry">Pantry</router-link><router-link to="/suggestions">Suggestions</router-link><button data-test="logout-button" @click="logout">Log out</button></div>
  </nav>
  <router-view />
</template>
<style scoped>
.nav { display:flex; justify-content:space-between; align-items:center; padding:var(--space-4) max(var(--space-4),calc((100% - 1120px)/2)); background:var(--color-surface); border-bottom:1px solid var(--color-line); }
.nav__brand { color:var(--color-ink); font:italic 600 var(--text-lg) var(--font-display); text-decoration:none; }
.nav__links { display:flex; gap:var(--space-6); align-items:center; }.nav__links a,.nav__links button { color:var(--color-muted); font-size:var(--text-sm); text-decoration:none; }.nav__links button { background:none;border:0;cursor:pointer; }
.nav__links a.router-link-active { color:var(--color-herb); }
@media(max-width:600px){.nav{align-items:flex-start}.nav__links{gap:var(--space-3);flex-wrap:wrap;justify-content:flex-end}}
</style>
