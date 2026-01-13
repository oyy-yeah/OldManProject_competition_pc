<template>
  <div class="p-6 md:p-8">
    <!-- 游戏头部 -->
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-black text-slate-900 flex items-center gap-2">
          <span class="material-symbols-outlined text-emerald-600 text-3xl">style</span>
          记忆配对
        </h2>
        <p class="text-slate-600 mt-1">翻开两张相同的卡片即可消除</p>
      </div>
      <div class="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
        <div class="text-center">
          <div class="text-xs text-slate-500 font-bold">步数</div>
          <div class="text-xl font-black text-slate-900">{{ moves }}</div>
        </div>
        <div class="w-px h-8 bg-slate-200"></div>
        <div class="text-center">
          <div class="text-xs text-slate-500 font-bold">配对</div>
          <div class="text-xl font-black text-emerald-600">{{ matches }}/{{ totalPairs }}</div>
        </div>
      </div>
    </div>

    <!-- 游戏控制区 -->
    <div class="flex justify-center gap-4 mb-8">
      <button 
        @click="initGame" 
        class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all"
      >
        <span class="material-symbols-outlined">refresh</span> 重新开始
      </button>
      <button 
        @click="$emit('exit')" 
        class="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all"
      >
        <span class="material-symbols-outlined">close</span> 退出游戏
      </button>
    </div>

    <!-- 卡片网格 -->
    <div class="grid grid-cols-4 gap-3 md:gap-4 max-w-[500px] mx-auto perspective-1000">
      <button
        v-for="(card, index) in cards"
        :key="index"
        @click="flipCard(index)"
        :disabled="card.flipped || card.matched"
        class="aspect-square relative w-full rounded-xl transition-all duration-300 transform-style-3d focus:outline-none focus:ring-4 focus:ring-blue-300"
        :class="card.flipped || card.matched ? 'rotate-y-180' : ''"
        :aria-label="`卡片 ${index + 1}`"
      >
        <!-- 背面 -->
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md backface-hidden flex items-center justify-center border-2 border-blue-400">
          <span class="material-symbols-outlined text-white text-3xl md:text-4xl opacity-50">help</span>
        </div>
        <!-- 正面 -->
        <div class="absolute inset-0 bg-white rounded-xl shadow-md backface-hidden rotate-y-180 flex items-center justify-center border-2"
          :class="card.matched ? 'border-emerald-400 bg-emerald-50' : 'border-blue-200'"
        >
          <span class="material-symbols-outlined text-4xl md:text-5xl" :class="card.matched ? 'text-emerald-600' : 'text-blue-600'">
            {{ card.icon }}
          </span>
        </div>
      </button>
    </div>

    <!-- 胜利弹窗 -->
    <div v-if="gameWon" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-up">
        <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-5xl">emoji_events</span>
        </div>
        <h3 class="text-2xl font-black text-slate-900 mb-2">挑战成功！</h3>
        <p class="text-slate-600 mb-6 text-lg">太棒了！您仅用了 <span class="text-blue-600 font-bold">{{ moves }}</span> 步就完成了挑战。</p>
        <div class="flex flex-col gap-3">
          <button @click="initGame" class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
            再玩一次
          </button>
          <button @click="$emit('exit')" class="w-full py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">
            返回列表
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const icons = ['pets', 'florist', 'wb_sunny', 'star', 'favorite', 'music_note', 'local_shipping', 'home']
const cards = ref([])
const flippedCards = ref([])
const moves = ref(0)
const matches = ref(0)
const totalPairs = 8
const gameWon = ref(false)
const isLocked = ref(false)

const initGame = () => {
  const pairs = [...icons, ...icons]
  cards.value = pairs
    .sort(() => Math.random() - 0.5)
    .map(icon => ({ icon, flipped: false, matched: false }))
  
  flippedCards.value = []
  moves.value = 0
  matches.value = 0
  gameWon.value = false
  isLocked.value = false
}

const flipCard = (index) => {
  if (isLocked.value || cards.value[index].flipped || cards.value[index].matched) return

  cards.value[index].flipped = true
  flippedCards.value.push(index)

  if (flippedCards.value.length === 2) {
    moves.value++
    isLocked.value = true
    checkForMatch()
  }
}

const checkForMatch = () => {
  const [first, second] = flippedCards.value
  if (cards.value[first].icon === cards.value[second].icon) {
    cards.value[first].matched = true
    cards.value[second].matched = true
    matches.value++
    flippedCards.value = []
    isLocked.value = false
    
    if (matches.value === totalPairs) {
      setTimeout(() => { gameWon.value = true }, 500)
    }
  } else {
    setTimeout(() => {
      cards.value[first].flipped = false
      cards.value[second].flipped = false
      flippedCards.value = []
      isLocked.value = false
    }, 1000)
  }
}

onMounted(initGame)
</script>

<style scoped>
.perspective-1000 { perspective: 1000px; }
.transform-style-3d { transform-style: preserve-3d; }
.backface-hidden { backface-visibility: hidden; }
.rotate-y-180 { transform: rotateY(180deg); }

@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
</style>
