<template>
  <NavBar v-if="showGlobalNav" />
  <main :class="mainClass">
    <router-view />
  </main>
  <AIAssistant v-if="showAIAssistant" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import AIAssistant from './components/AIAssistant.vue'

const route = useRoute()

const showGlobalNav = computed(() => route.meta?.showGlobalNav !== false)
const showAIAssistant = computed(() => route.name !== 'Survey')

const mainClass = computed(() => {
  if (route.meta?.fullWidth) return 'w-full'
  return 'max-w-[1280px] mx-auto w-full px-6 py-8 lg:px-20'
})
</script>

<style>
html, body, #app { height: 100%; }
</style>
