<template>
  <div class="w-full bg-slate-50 min-h-screen">
    <div class="mx-auto w-full max-w-[1000px] px-4 py-8">
      <!-- 游戏导航头 -->
      <header class="mb-8 flex items-center justify-between">
        <button 
          @click="$emit('back')" 
          class="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 active:scale-95 transition-all"
        >
          <span class="material-symbols-outlined">arrow_back</span>
          返回发现页
        </button>
        <h1 class="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2">
          <span class="material-symbols-outlined text-orange-500 text-3xl">sports_esports</span>
          益智游戏专区
        </h1>
        <div class="w-[100px]"></div> <!-- 占位保持标题居中 -->
      </header>

      <!-- 游戏选择列表 -->
      <div v-if="!currentGame" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
        <button
          v-for="game in games"
          :key="game.id"
          @click="selectGame(game.id)"
          class="group relative bg-white rounded-2xl p-6 shadow-sm border-2 border-slate-100 hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-left flex flex-col h-full"
        >
          <div class="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-white text-3xl shadow-md transition-transform group-hover:scale-110" :class="game.color">
            <span class="material-symbols-outlined text-4xl">{{ game.icon }}</span>
          </div>
          <h3 class="text-xl font-black text-slate-900 mb-2">{{ game.name }}</h3>
          <p class="text-slate-600 text-base mb-4 flex-1">{{ game.desc }}</p>
          <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 w-full">
            <span class="text-sm font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {{ getDifficultyLabel(game.difficulty) }}
            </span>
            <span class="flex items-center gap-1 text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
              开始游戏 <span class="material-symbols-outlined text-lg">play_circle</span>
            </span>
          </div>
        </button>
      </div>

      <!-- 游戏容器 -->
      <div v-else class="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden animate-fade-in">
        <component 
          :is="currentGameComponent" 
          @exit="exitGame"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MemoryMatch from './MemoryMatch.vue'
import NumberSlide from './NumberSlide.vue'
import SimpleSudoku from './SimpleSudoku.vue'

const emit = defineEmits(['back'])

const games = [
  { 
    id: 'memory', 
    name: '记忆配对', 
    desc: '翻开卡片寻找相同的图案，锻炼短期记忆力。', 
    icon: 'style', 
    color: 'bg-emerald-500',
    difficulty: 'easy'
  },
  { 
    id: 'slide', 
    name: '数字华容道', 
    desc: '移动数字方块按顺序排列，锻炼逻辑思维。', 
    icon: 'apps', 
    color: 'bg-blue-500',
    difficulty: 'medium'
  },
  { 
    id: 'sudoku', 
    name: '简单数独', 
    desc: '在空格中填入数字，让每行每列数字不重复。', 
    icon: 'grid_on', 
    color: 'bg-indigo-500',
    difficulty: 'hard'
  }
]

const currentGame = ref(null)

const currentGameComponent = computed(() => {
  switch (currentGame.value) {
    case 'memory': return MemoryMatch
    case 'slide': return NumberSlide
    case 'sudoku': return SimpleSudoku
    default: return null
  }
})

const selectGame = (id) => {
  currentGame.value = id
}

const exitGame = () => {
  currentGame.value = null
}

const getDifficultyLabel = (level) => {
  const map = { easy: '简单', medium: '中等', hard: '挑战' }
  return map[level] || '入门'
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
