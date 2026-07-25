<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/axios'

const route = useRoute()
const recipe = ref(null)
const loading = ref(true)
const error = ref('')
const ingName = (item) => item.name ?? item.ingredient?.name
const quantity = (item) => [item.quantity ?? item.amount, item.unit].filter(Boolean).join(' ')

onMounted(async () => {
  try {
    const { data } = await api.get(`/recipes/${route.params.id}`)
    recipe.value = data.data ?? data
  } catch (exception) {
    error.value = exception.response?.data?.message ?? 'Could not load this recipe.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="detail">
    <router-link class="back" to="/suggestions">← Back to suggestions</router-link>
    <p v-if="loading">Reading the recipe…</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <article v-else-if="recipe">
      <div class="title-row">
        <div>
          <h1>{{ recipe.title ?? recipe.name }}</h1>
          <p class="meta">{{ (recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0) }} min · serves {{ recipe.servings ?? '—' }} · <span>{{ recipe.ease_tier ?? recipe.ease }}</span></p>
        </div>
        <router-link class="btn btn--tomato cook-link" :to="`/recipes/${route.params.id}/cook`" data-test="start-cooking">Start cooking</router-link>
      </div>
      <h2>Ingredients</h2>
      <ul><li v-for="ing in recipe.ingredients ?? []" :key="ing.id ?? ingName(ing)" data-test="ingredient-row" :data-have="Boolean(ing.have_it)" :class="{ have: ing.have_it }"><span class="dot"/><span>{{ quantity(ing) }} {{ ingName(ing) }}</span><small v-if="ing.optional">optional</small></li></ul>
      <h2>Instructions</h2><div class="instructions">{{ recipe.instructions }}</div>
    </article>
  </main>
</template>

<style scoped>
.detail{max-width:700px;margin:auto;padding:var(--space-8) var(--space-6) var(--space-12)}.back{color:var(--color-herb)}.title-row{display:flex;justify-content:space-between;align-items:flex-end;gap:var(--space-6)}h1{font:italic 600 var(--text-2xl) var(--font-display);margin:var(--space-8) 0 var(--space-2)}.meta{color:var(--color-muted);margin:0}.meta span{padding:var(--space-1) var(--space-2);border-radius:var(--radius-sm);background:var(--color-herb-soft);color:var(--color-herb);font:var(--text-xs) var(--font-mono)}.cook-link{flex-shrink:0;text-decoration:none}h2{margin:var(--space-8) 0 var(--space-4);padding-bottom:var(--space-2);border-bottom:1px solid var(--color-line);font:600 var(--text-lg) var(--font-display)}ul{list-style:none;padding:0}li{display:flex;align-items:center;gap:var(--space-2);padding:var(--space-2) 0;color:var(--color-muted)}li.have{color:var(--color-ink)}.dot{width:11px;height:11px;border:2px dashed var(--color-missing);border-radius:50%}.have .dot{border:0;background:var(--color-herb)}li small{margin-left:auto;color:var(--color-muted)}.instructions{white-space:pre-line;line-height:1.7}.error{color:var(--color-tomato)}@media(max-width:600px){.title-row{align-items:stretch;flex-direction:column}.cook-link{text-align:center}}
</style>
