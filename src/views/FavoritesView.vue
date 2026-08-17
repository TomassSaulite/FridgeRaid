<template>
    <v-container class="py-8">
        <v-row class="mb-6">
            <v-col>
                <h1>Favorites</h1>
                <p class="text-medium-emphasis">
                    Recipes you saved for later.
                </p>
            </v-col>
        </v-row>

        <div v-if="loading" class="d-flex justify-center py-12">
            <v-progress-circular indeterminate color="primary" size="48" />
        </div>

        <v-alert v-else-if="error" type="error" variant="tonal" class="mb-6">
            {{ error }}
        </v-alert>

        <v-row v-else-if="recipes.length">
            <v-col v-for="recipe in recipes" :key="recipe.id" cols="12" sm="6" md="4">
                <RecipeCard :recipe="recipe" />
            </v-col>
        </v-row>

        <v-empty-state v-else icon="mdi-heart-outline" title="No favorites yet"
            text="Favorite some recipes and they will appear here." />
    </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from '../api/axios'
import RecipeCard from '../components/RecipeCard.vue'

const recipes = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
    try {
        const { data } = await api.get('/favorites')
        recipes.value = data.favorite_recipes
    } catch (exception) {
        error.value =
            exception.response?.data?.message ??
            'Could not load favorites.'
    } finally {
        loading.value = false
    }
})
</script>