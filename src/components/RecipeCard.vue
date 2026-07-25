<script setup>
import { computed } from 'vue'

const props = defineProps({ recipe: { type: Object, required: true } })
const item = computed(() => props.recipe.recipe ?? props.recipe)
const required = computed(() => props.recipe.required_ingredients ?? item.value.ingredients ?? [])
const missingDetails = computed(() => props.recipe.missing_ingredients ?? [])
const have = computed(() => required.value.filter((ingredient) => ingredient.have_it))
const unavailable = computed(() => required.value.filter((ingredient) => !ingredient.have_it).map((ingredient) => ({
  ...ingredient,
  substitute: missingDetails.value.find((missing) => missing.id === ingredient.id)?.substitute ?? ingredient.substitute,
})))
const name = (value) => value.ingredient_name ?? value.ingredient?.name ?? value.name ?? String(value)
const ease = computed(() => item.value.ease_tier ?? item.value.ease ?? 'normal')
const score = computed(() => {
  const value = props.recipe.smart_match_score ?? props.recipe.match_score ?? props.recipe.score ?? 0
  return Math.round(value <= 1 ? value * 100 : value)
})
const substituteName = (ingredient) => ingredient.substitute?.name ?? ingredient.substitute?.path?.at(-1)
</script>

<template>
  <article class="card" data-test="recipe-card">
    <div class="card__top">
      <span class="ease" :class="`ease--${ease}`">{{ ease }}</span>
      <span class="score">{{ score }}% match</span>
    </div>
    <h2>{{ item.title ?? item.name }}</h2>
    <p v-if="item.description" class="description">{{ item.description }}</p>

    <div class="shelf" data-test="ingredient-shelf" aria-label="Ingredient availability">
      <span v-for="ingredient in have" :key="`have-${ingredient.id ?? name(ingredient)}`" class="jar jar--have" :class="{ 'jar--soon': ingredient.expiring_soon }" :title="`${name(ingredient)}: in your pantry`" />
      <span v-for="ingredient in unavailable" :key="`missing-${ingredient.id ?? name(ingredient)}`" class="jar" :class="ingredient.substitute ? 'jar--substitute' : 'jar--missing'" :title="ingredient.substitute ? `${name(ingredient)}: substitute with ${substituteName(ingredient)}` : `${name(ingredient)}: missing`" />
    </div>

    <div class="legend" aria-label="Shelf legend"><span><i class="legend-dot legend-dot--have"/>Have</span><span><i class="legend-dot legend-dot--substitute"/>Substitute</span><span><i class="legend-dot legend-dot--missing"/>Missing</span></div>
    <div v-if="unavailable.length" class="missing">
      <span v-for="ingredient in unavailable" :key="ingredient.id ?? name(ingredient)" :class="{ 'chip--substitute': ingredient.substitute }">{{ name(ingredient) }}<template v-if="ingredient.substitute"> → {{ substituteName(ingredient) }}</template></span>
    </div>
    <router-link class="cta" :to="`/recipes/${item.id}`" data-test="view-recipe">View recipe <span>→</span></router-link>
  </article>
</template>

<style scoped>
.card{display:flex;flex-direction:column;min-width:0;min-height:320px;padding:var(--space-6);overflow:hidden;background:var(--color-surface);border:1px solid var(--color-line);border-radius:var(--radius-lg)}.card__top{display:flex;justify-content:space-between;align-items:center;gap:var(--space-2)}.ease,.score{font:var(--text-xs) var(--font-mono);text-transform:uppercase;white-space:nowrap}.ease{padding:var(--space-1) var(--space-2);border-radius:var(--radius-sm);background:var(--color-herb-soft);color:var(--color-herb)}.ease--ambitious{background:#f3e8f7;color:#6b3d78}.ease--lazy{background:#fff4d5;color:#805d00}.score{color:var(--color-muted)}h2{font:italic 600 var(--text-xl)/1.2 var(--font-display);margin:var(--space-4) 0 var(--space-2);overflow-wrap:anywhere}.description{margin:0;color:var(--color-muted);overflow-wrap:anywhere}.shelf{display:flex;flex-wrap:wrap;align-content:flex-end;align-items:flex-end;gap:7px;min-width:0;min-height:58px;margin-top:auto;padding:var(--space-6) var(--space-2) 5px;border-bottom:5px solid var(--color-line)}.jar{display:block;flex:0 0 18px;width:18px;height:28px;border-radius:5px 5px 7px 7px}.jar--have{background:var(--color-herb);border:2px solid var(--color-herb)}.jar--missing{border:2px dashed var(--color-missing)}.jar--substitute{background:#fff4d5;border:2px solid var(--color-butter)}.jar--soon{background:var(--color-butter);border-color:var(--color-butter);animation:pulse 1.5s infinite}@keyframes pulse{50%{opacity:.5}}.legend{display:flex;flex-wrap:wrap;gap:var(--space-3);margin-top:var(--space-2);color:var(--color-muted);font-size:.65rem}.legend span{display:flex;align-items:center;gap:4px}.legend-dot{width:7px;height:7px;border-radius:50%}.legend-dot--have{background:var(--color-herb)}.legend-dot--substitute{background:var(--color-butter)}.legend-dot--missing{border:1px dashed var(--color-missing)}.missing{display:flex;flex-wrap:wrap;gap:var(--space-1);min-width:0;margin:var(--space-3) 0}.missing span{max-width:100%;padding:2px var(--space-2);border-radius:99px;background:#eee9e2;color:#6f6255;font-size:var(--text-xs);overflow-wrap:anywhere}.missing .chip--substitute{background:#fff4d5;color:#805d00}.cta{display:flex;justify-content:space-between;margin-top:var(--space-3);color:var(--color-tomato);font-weight:600;text-decoration:none}
</style>
