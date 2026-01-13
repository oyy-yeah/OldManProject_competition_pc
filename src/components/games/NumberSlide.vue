<template>
  <div class="p-6 md:p-8">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-black text-slate-900 flex items-center gap-2">
          <span class="material-symbols-outlined text-blue-600 text-3xl">apps</span>
          数字华容道
        </h2>
        <p class="text-slate-600 mt-1">移动方块，将数字按1-8顺序排列</p>
      </div>
      <div class="bg-slate-50 px-6 py-2 rounded-xl border border-slate-200 text-center">
        <div class="text-xs text-slate-500 font-bold">步数</div>
        <div class="text-xl font-black text-slate-900">{{ moves }}</div>
      </div>
    </div>

    <div class="flex justify-center gap-4 mb-8">
      <button @click="initGame" class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all">
        <span class="material-symbols-outlined">refresh</span> 重新开始
      </button>
      <button @click="$emit('exit')" class="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all">
        <span class="material-symbols-outlined">close</span> 退出
      </button>
    </div>

    <!-- 游戏棋盘 3x3 -->
    <div class="bg-slate-200 p-2 rounded-2xl max-w-[320px] mx-auto shadow-inner">
      <div class="grid grid-cols-3 gap-2 bg-slate-300/50 rounded-xl p-1">
        <button
          v-for="(num, index) in board"
          :key="index"
          @click="moveTile(index)"
          :disabled="num === 0 || gameWon"
          class="aspect-square rounded-xl text-3xl font-black shadow-sm transition-all duration-200 flex items-center justify-center relative"
          :class="[
            num === 0 ? 'invisible pointer-events-none' : 'bg-white text-blue-600 hover:bg-blue-50 active:scale-95 cursor-pointer',
            isCorrect(index, num) ? 'text-emerald-600' : ''
          ]"
        >
          {{ num }}
        </button>
      </div>
    </div>

    <div v-if="gameWon" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-up">
        <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-5xl">celebration</span>
        </div>
        <h3 class="text-2xl font-black text-slate-900 mb-2">排序完成！</h3>
        <p class="text-slate-600 mb-6 text-lg">您的逻辑思维太棒了！步数：<span class="text-blue-600 font-bold">{{ moves }}</span></p>
        <div class="flex flex-col gap-3">
          <button @click="initGame" class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
            挑战下一局
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

const board = ref([])
const moves = ref(0)
const gameWon = ref(false)
const size = 3

const initGame = () => {
  const nums = Array.from({ length: size * size - 1 }, (_, i) => i + 1)
  nums.push(0) // 0 表示空格
  
  // 简单的打乱算法（确保有解）
  // 这里为了简单，先模拟随机移动打乱，保证一定可解
  let currentBoard = [...nums]
  let emptyIdx = size * size - 1
  let shuffleMoves = 0
  const maxShuffle = 50
  
  while (shuffleMoves < maxShuffle) {
    const neighbors = getNeighbors(emptyIdx)
    const randomIdx = neighbors[Math.floor(Math.random() * neighbors.length)]
    
    // 交换
    currentBoard[emptyIdx] = currentBoard[randomIdx]
    currentBoard[randomIdx] = 0
    emptyIdx = randomIdx
    shuffleMoves++
  }
  
  board.value = currentBoard
  moves.value = 0
  gameWon.value = false
}

const getNeighbors = (idx) => {
  const neighbors = []
  const row = Math.floor(idx / size)
  const col = idx % size
  
  if (row > 0) neighbors.push(idx - size) // 上
  if (row < size - 1) neighbors.push(idx + size) // 下
  if (col > 0) neighbors.push(idx - 1) // 左
  if (col < size - 1) neighbors.push(idx + 1) // 右
  
  return neighbors
}

const moveTile = (index) => {
  if (gameWon.value) return
  
  const emptyIdx = board.value.indexOf(0)
  const neighbors = getNeighbors(emptyIdx)
  
  if (neighbors.includes(index)) {
    // 交换
    board.value[emptyIdx] = board.value[index]
    board.value[index] = 0
    moves.value++
    checkWin()
  }
}

const isCorrect = (index, num) => {
  if (num === 0) return false
  return index + 1 === num
}

const checkWin = () => {
  // 检查是否为 1,2,3...8,0
  const isSorted = board.value.every((num, idx) => {
    if (idx === size * size - 1) return num === 0
    return num === idx + 1
  })
  
  if (isSorted) {
    setTimeout(() => { gameWon.value = true }, 200)
  }
}

onMounted(initGame)
</script>

<style scoped>
@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
</style>
