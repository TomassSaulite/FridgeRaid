<script setup>
import { usePantryStore } from '../stores/pantry'

const pantry = usePantryStore()
const recipeScore = (value) => Math.round(value <= 1 ? value * 100 : value)
</script>

<template>
  <section class="shop-card" data-test="one-shop-away">
    <header class="shop-card__header">
      <div><p class="eyebrow">PANTRY SHORTCUT</p><h2>One shop away</h2></div>
      <router-link to="/pantry">View pantry</router-link>
    </header>

    <div v-if="pantry.oneShopAwayLoading" class="skeleton-list" aria-label="Loading shopping opportunities">
      <div v-for="n in 3" :key="n" class="skeleton"><span/><div><i/><i/></div></div>
    </div>
    <p v-else-if="pantry.oneShopAwayError" class="shop-error" role="alert">{{ pantry.oneShopAwayError }}</p>
    <div v-else-if="pantry.oneShopAway.length" class="opportunities">
      <article v-for="(opportunity, index) in pantry.oneShopAway" :key="opportunity.ingredient.id" class="opportunity" :class="{ 'opportunity--best': index === 0 }">
        <div class="opportunity__main">
          <div v-if="index === 0" class="best-label"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 8h12l1 12H5L6 8Zm3 1V6a3 3 0 0 1 6 0v3"/></svg> Best next buy</div>
          <h3>Buy {{ opportunity.ingredient.name }}</h3>
          <p>Unlocks {{ opportunity.unlock_count }} {{ opportunity.unlock_count === 1 ? 'recipe' : 'recipes' }}</p>
          <span v-if="opportunity.expiring_recipe_count > 0" class="expiry-badge">Uses {{ opportunity.expiring_recipe_count }} expiring {{ opportunity.expiring_recipe_count === 1 ? 'ingredient' : 'ingredients' }}</span>
        </div>
        <ul v-if="opportunity.recipes?.length" class="recipe-links">
          <li v-for="recipe in opportunity.recipes.slice(0, 3)" :key="recipe.id">
            <router-link :to="`/recipes/${recipe.id}`"><span>{{ recipe.title }}</span><small>{{ recipeScore(recipe.match_score) }}% →</small></router-link>
          </li>
        </ul>
      </article>
    </div>
    <div v-else class="shop-empty"><span aria-hidden="true">✓</span><p>Your pantry already covers the closest recipe matches.</p></div>
  </section>
</template>

<style scoped>
.shop-card{margin:var(--space-8) 0;padding:var(--space-6);background:var(--color-surface);border:1px solid var(--color-line);border-radius:var(--radius-lg)}.shop-card__header{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-4);margin-bottom:var(--space-6)}.eyebrow{margin:0 0 var(--space-1);color:var(--color-herb);font:500 var(--text-xs) var(--font-mono);letter-spacing:.1em}.shop-card h2{margin:0;font:italic 600 var(--text-xl) var(--font-display)}.shop-card__header a{flex-shrink:0;color:var(--color-herb);font-size:var(--text-sm);font-weight:600}.opportunities{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-3)}.opportunity{display:grid;grid-template-columns:minmax(130px,.8fr) minmax(0,1.2fr);gap:var(--space-4);min-width:0;padding:var(--space-4);border:1px solid var(--color-line);border-radius:var(--radius-md);background:var(--color-surface-raised)}.opportunity--best{grid-column:1/-1;padding:var(--space-6);background:linear-gradient(110deg,var(--color-herb-soft),var(--color-surface-raised));border-color:#bfd2c1}.best-label{display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2);color:var(--color-herb);font:500 var(--text-xs) var(--font-mono);text-transform:uppercase}.best-label svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linejoin:round}h3{margin:0;font:italic 600 var(--text-lg) var(--font-display);overflow-wrap:anywhere}.opportunity__main p{margin:var(--space-1) 0;color:var(--color-muted);font-size:var(--text-sm)}.expiry-badge{display:inline-flex;margin-top:var(--space-2);padding:3px var(--space-2);border-radius:99px;background:#fff1c7;color:#795600;font-size:var(--text-xs);font-weight:600}.recipe-links{align-self:center;margin:0;padding:0;list-style:none}.recipe-links li+li{border-top:1px solid var(--color-line)}.recipe-links a{display:flex;justify-content:space-between;gap:var(--space-3);padding:var(--space-2);color:var(--color-ink);font-size:var(--text-sm);text-decoration:none}.recipe-links a:hover span{color:var(--color-tomato)}.recipe-links span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.recipe-links small{flex-shrink:0;color:var(--color-muted);font:var(--text-xs) var(--font-mono)}.shop-empty{display:flex;align-items:center;justify-content:center;gap:var(--space-3);padding:var(--space-8);border:1px dashed var(--color-line);border-radius:var(--radius-md);color:var(--color-muted);text-align:center}.shop-empty span{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--color-herb-soft);color:var(--color-herb)}.shop-error{color:var(--color-tomato)}.skeleton-list{display:grid;gap:var(--space-3)}.skeleton{display:flex;gap:var(--space-4);padding:var(--space-4);border:1px solid var(--color-line);border-radius:var(--radius-md)}.skeleton span,.skeleton i{display:block;border-radius:6px;background:linear-gradient(90deg,#edf0e9,#f7f8f5,#edf0e9);background-size:200% 100%;animation:shimmer 1.2s infinite}.skeleton span{width:34%;height:52px}.skeleton div{flex:1}.skeleton i{height:12px;margin:7px 0}.skeleton i:last-child{width:65%}@keyframes shimmer{to{background-position:-200% 0}}@media(max-width:760px){.opportunities{grid-template-columns:1fr}.opportunity--best{grid-column:auto}.opportunity{grid-template-columns:1fr}.shop-card{padding:var(--space-4)}}
</style>
