<template>
  <div class="p-6 md:p-8">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-black text-slate-900 flex items-center gap-2">
          <span class="material-symbols-outlined text-indigo-600 text-3xl">grid_on</span>
          简单数独
        </h2>
        <p class="text-slate-600 mt-1">填入1-4，每行每列每宫不重复</p>
      </div>
      <div class="bg-slate-50 px-6 py-2 rounded-xl border border-slate-200 text-center">
        <div class="text-xs text-slate-500 font-bold">错误</div>
        <div class="text-xl font-black text-rose-500">{{ errors }}/3</div>
      </div>
    </div>

    <div class="flex justify-center gap-4 mb-8">
      <button @click="initGame" class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all">
        <span class="material-symbols-outlined">refresh</span> 新局
      </button>
      <button @click="$emit('exit')" class="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all">
        <span class="material-symbols-outlined">close</span> 退出
      </button>
    </div>

    <!-- 数独 4x4 网格 -->
    <div class="max-w-[320px] mx-auto bg-slate-800 p-1 rounded-xl shadow-lg">
      <div class="grid grid-cols-4 gap-1 bg-slate-800 border-2 border-slate-800">
        <div
          v-for="(cell, index) in board"
          :key="index"
          class="aspect-square bg-white flex items-center justify-center relative cursor-pointer hover:bg-blue-50 transition-colors"
          :class="[
            selectedCell === index ? 'bg-blue-100 ring-2 ring-inset ring-blue-500 z-10' : '',
            cell.fixed ? 'bg-slate-100 font-bold text-slate-900' : 'text-blue-600 font-medium',
            // 宫格粗边框处理
            (index % 4 === 1) ? 'border-r-2 border-slate-300' : '',
            (Math.floor(index / 4) === 1) ? 'border-b-2 border-slate-300' : ''
          ]"
          @click="selectCell(index)"
        >
          <span class="text-2xl">{{ cell.value || '' }}</span>
        </div>
      </div>
    </div>

    <!-- 数字键盘 -->
    <div class="max-w-[320px] mx-auto mt-6 grid grid-cols-4 gap-3">
      <button
        v-for="n in 4"
        :key="n"
        @click="fillNumber(n)"
        class="h-14 rounded-xl bg-white border-2 border-slate-200 text-2xl font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 active:scale-95 transition-all shadow-sm"
      >
        {{ n }}
      </button>
      <button 
        @click="fillNumber(null)"
        class="col-span-4 h-12 mt-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
      >
        <span class="material-symbols-outlined text-lg">backspace</span> 清除
      </button>
    </div>

    <div v-if="gameWon || gameOver" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-up">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" :class="gameWon ? 'bg-indigo-100 text-indigo-600' : 'bg-rose-100 text-rose-600'">
          <span class="material-symbols-outlined text-5xl">{{ gameWon ? 'emoji_events' : 'sentiment_very_dissatisfied' }}</span>
        </div>
        <h3 class="text-2xl font-black text-slate-900 mb-2">{{ gameWon ? '挑战成功！' : '游戏结束' }}</h3>
        <p class="text-slate-600 mb-6 text-lg">{{ gameWon ? '您的大脑非常敏锐！' : '错误次数过多，请再接再厉。' }}</p>
        <div class="flex flex-col gap-3">
          <button @click="initGame" class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all">
            {{ gameWon ? '再来一局' : '重试一次' }}
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

// 4x4 数独简单模板（实际应生成）
const solutionTemplate = [
  [1, 2, 3, 4],
  [3, 4, 1, 2],
  [2, 1, 4, 3],
  [4, 3, 2, 1]
]

const board = ref([])
const selectedCell = ref(null)
const errors = ref(0)
const gameWon = ref(false)
const gameOver = ref(false)

const initGame = () => {
  // 简单的行列变换生成新局
  let grid = JSON.parse(JSON.stringify(solutionTemplate))
  
  // 挖空（保留约 50% 数字）
  board.value = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const val = grid[r][c]
      const isFixed = Math.random() > 0.5
      board.value.push({
        value: isFixed ? val : null,
        solution: val,
        fixed: isFixed
      })
    }
  }
  
  selectedCell.value = null
  errors.value = 0
  gameWon.value = false
  gameOver.value = false
}

const selectCell = (index) => {
  if (board.value[index].fixed) return
  selectedCell.value = index
}

const fillNumber = (num) => {
  if (selectedCell.value === null || gameOver.value || gameWon.value) return
  
  const cell = board.value[selectedCell.value]
  
  if (num === null) {
    cell.value = null
    return
  }

  // 检查是否正确（简单模式即时反馈）
  if (num !== cell.solution) {
    errors.value++
    if (errors.value >= 3) {
      gameOver.value = true
    }
  } else {
    cell.value = num
    checkWin()
  }
}

const checkWin = () => {
  const isFull = board.value.every(cell => cell.value === cell.solution)
  if (isFull) {
    setTimeout(() => { gameWon.value = true }, 300)
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
