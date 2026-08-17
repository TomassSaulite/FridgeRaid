<script setup>
import { onMounted } from 'vue'

import RecipeCard from '../components/RecipeCard.vue'
import OneShopAway from '../components/OneShopAway.vue'

import { useRecipesStore } from '../stores/recipes'
import { usePantryStore } from '../stores/pantry'

const recipes = useRecipesStore()
const pantry = usePantryStore()

const tiers = [
  ['', 'All'],
  ['lazy', 'Lazy'],
  ['normal', 'Normal'],
  ['ambitious', 'Ambitious'],
]

function filter(value) {
  recipes.filters.ease = value || null
  recipes.fetchSuggestions()
}

onMounted(() => {
  recipes.fetchSuggestions()
  pantry.fetchOneShopAway()
})
</script>

<template>
  <v-container class="py-8">

    <!-- Header -->
    <v-row align="end" class="mb-6">
      <v-col>
        <h1 class="text-h3 font-weight-bold">
          What can we make?
        </h1>

        <p class="text-medium-emphasis mt-2">
          Ranked by what is already waiting in your kitchen.
        </p>
      </v-col>

      <v-col cols="auto">
        <v-btn
          to="/pantry"
          variant="text"
          prepend-icon="mdi-fridge-outline"
        >
          Edit pantry
        </v-btn>
      </v-col>
    </v-row>

    <!-- One shop away -->
    <OneShopAway />

    <!-- Ease filter -->
    <v-btn-toggle
      :model-value="recipes.filters.ease ?? ''"
      class="my-6"
      divided
      mandatory
      data-test="ease-filter"
    >
      <v-btn
        v-for="[value, label] in tiers"
        :key="value"
        :value="value"
        @click="filter(value)"
      >
        {{ label }}
      </v-btn>
    </v-btn-toggle>

    <!-- Error -->
    <v-alert
      v-if="recipes.error"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      {{ recipes.error }}
    </v-alert>

    <!-- Loading -->
    <div
      v-if="recipes.loading"
      class="d-flex flex-column align-center justify-center py-12"
    >
      <v-progress-circular
        indeterminate
        size="48"
        class="mb-4"
      />

      <span class="text-medium-emphasis">
        Checking the pantry shelves…
      </span>
    </div>

    <!-- Recipe cards -->
    <v-row v-else-if="recipes.suggestions.length">
      <v-col
        v-for="suggestion in recipes.suggestions"
        :key="suggestion.id ?? suggestion.recipe?.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RecipeCard :recipe="suggestion" />
      </v-col>
    </v-row>

    <!-- No recipes -->
    <v-empty-state
      v-else
      icon="mdi-food-off"
      title="Nothing matches yet"
      text="Add a few things to your pantry and this fills up fast."
    />

  </v-container>
</template>