<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/axios'

const route = useRoute()
const router = useRouter()
const recipe = ref(null)
const loading = ref(true)
const error = ref('')
const currentStep = ref(0)
const timerSeconds = ref(0)
const timerRunning = ref(false)
let interval

const steps = computed(() => {
  const instructions = recipe.value?.instructions
  if (Array.isArray(instructions)) return instructions.map((step) => step.text ?? step).filter(Boolean)
  return String(instructions ?? '').split(/\r?\n/).map((step) => step.replace(/^\s*\d+[.)]\s*/, '').trim()).filter(Boolean)
})
const formattedTime = computed(() => `${Math.floor(timerSeconds.value / 60)}:${String(timerSeconds.value % 60).padStart(2, '0')}`)

function stopTimer() { timerRunning.value = false; clearInterval(interval) }
function resetTimer() { stopTimer(); timerSeconds.value = 0 }
function next() { if (currentStep.value < steps.value.length - 1) currentStep.value++; resetTimer() }
function prev() { if (currentStep.value > 0) currentStep.value--; resetTimer() }
function toggleTimer() {
  if (timerRunning.value) return stopTimer()
  timerRunning.value = true
  interval = setInterval(() => timerSeconds.value++, 1000)
}
function finish() {
  localStorage.setItem('recipesCooked', Number(localStorage.getItem('recipesCooked') || 0) + 1)
  router.push('/suggestions')
}

onMounted(async () => {
  try {
    const { data } = await api.get(`/recipes/${route.params.id}`)
    recipe.value = data.data ?? data
    if (!steps.value.length) error.value = 'This recipe does not have cooking steps yet.'
  } catch (exception) {
    error.value = exception.response?.data?.message ?? 'Could not load cook mode.'
  } finally {
    loading.value = false
  }
})
onUnmounted(stopTimer)
</script>

<template>
  <main class="cook-mode">
    <button class="cook-mode__exit" aria-label="Exit cook mode" @click="router.back()">×</button>
    <p v-if="loading" class="status">Preparing your cooking steps…</p>
    <div v-else-if="error" class="status"><p>{{ error }}</p><button class="btn" @click="router.back()">Go back</button></div>
    <template v-else>
      <div class="cook-mode__progress" :aria-label="`Step ${currentStep + 1} of ${steps.length}`">
        <span v-for="(_, i) in steps" :key="i" class="progress-dot" :class="{ 'progress-dot--active': i === currentStep, 'progress-dot--done': i < currentStep }" />
      </div>
      <section class="cook-mode__step" aria-live="polite">
        <p class="cook-mode__recipe">{{ recipe.title ?? recipe.name }}</p>
        <p class="cook-mode__step-label">Step {{ currentStep + 1 }} of {{ steps.length }}</p>
        <h1 class="cook-mode__step-text">{{ steps[currentStep] }}</h1>
        <div class="cook-mode__timer">
          <span class="cook-mode__timer-display" data-test="cook-timer">{{ formattedTime }}</span>
          <button class="btn btn--tomato" data-test="timer-toggle" @click="toggleTimer">{{ timerRunning ? 'Pause' : 'Start timer' }}</button>
          <button v-if="timerSeconds" class="timer-reset" @click="resetTimer">Reset</button>
        </div>
      </section>
      <nav class="cook-mode__nav" aria-label="Cooking steps">
        <button class="btn" :disabled="currentStep === 0" @click="prev">Back</button>
        <button v-if="currentStep < steps.length - 1" class="btn btn--tomato" data-test="next-step" @click="next">Next step</button>
        <button v-else class="btn btn--tomato" data-test="finish-cooking" @click="finish">Done cooking</button>
      </nav>
    </template>
  </main>
</template>

<style scoped>
.cook-mode{min-height:100svh;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:var(--space-12) var(--space-8) 7rem;background:var(--color-ink);color:var(--color-surface)}.cook-mode__exit{position:absolute;top:var(--space-6);right:var(--space-6);border:0;background:none;color:inherit;font-size:var(--text-xl);cursor:pointer;opacity:.7}.cook-mode__exit:hover{opacity:1}.cook-mode__progress{display:flex;flex-wrap:wrap;justify-content:center;gap:var(--space-2);margin-bottom:var(--space-8)}.progress-dot{width:8px;height:8px;border-radius:50%;background:#ffffff33;transition:background var(--duration-base) var(--ease-standard)}.progress-dot--active{background:var(--color-butter)}.progress-dot--done{background:#6fa37b}.cook-mode__step{width:min(100%,620px);text-align:center}.cook-mode__recipe{color:#ffffff8c;font:italic var(--text-lg) var(--font-display)}.cook-mode__step-label{margin-bottom:var(--space-2);color:#ffffff80;font:var(--text-sm) var(--font-mono)}.cook-mode__step-text{margin:0 0 var(--space-8);font:600 clamp(1.5rem,4vw,var(--text-xl))/1.4 var(--font-display)}.cook-mode__timer{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:var(--space-4)}.cook-mode__timer-display{min-width:5ch;font:var(--text-lg) var(--font-mono)}.timer-reset{border:0;background:none;color:#ffffffaa;cursor:pointer}.cook-mode__nav{position:absolute;bottom:var(--space-8);display:flex;gap:var(--space-4)}.cook-mode .btn:not(.btn--tomato){background:#ffffff18;color:white}.cook-mode .btn:disabled{opacity:.3;cursor:not-allowed}.status{text-align:center;color:#ffffffaa}@media(max-width:600px){.cook-mode{padding-inline:var(--space-4)}.cook-mode__nav{width:calc(100% - 2rem)}.cook-mode__nav .btn{flex:1}}
</style>
