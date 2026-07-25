<script setup>
import { ref } from 'vue'; import { useRouter } from 'vue-router'; import { useAuthStore } from '../stores/auth'
const auth=useAuthStore(),router=useRouter(),email=ref(''),password=ref(''),error=ref(''),loading=ref(false)
async function submit(){loading.value=true;error.value='';try{await auth.login(email.value,password.value);router.push('/suggestions')}catch{error.value='Wrong email or password.'}finally{loading.value=false}}
</script>
<template><main class="auth-page"><form class="auth-card" @submit.prevent="submit"><p class="eyebrow">FRIDGE → DINNER</p><h1>Welcome back</h1><label>Email<input v-model="email" data-test="email-input" type="email" autocomplete="email" required></label><label>Password<input v-model="password" data-test="password-input" type="password" autocomplete="current-password" required></label><button class="btn btn--tomato" data-test="login-submit" :disabled="loading">{{ loading?'Opening the pantry…':'Log in' }}</button><p v-if="error" class="error" role="alert">{{ error }}</p><p class="switch">New here? <router-link to="/register">Create an account</router-link></p></form></main></template>
<style scoped src="../assets/auth.css"></style>
