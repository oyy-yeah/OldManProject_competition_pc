<template>
  <div class="fixed z-[9999]" :style="containerStyle" ref="assistantRef">
    <!-- 浮动按钮 (收起状态) -->
    <button
      v-if="!isOpen"
      ref="floatBtn"
      class="w-[60px] h-[60px] rounded-full bg-blue-600/90 text-white shadow-xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-move select-none backdrop-blur-sm"
      :style="{ boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)' }"
      aria-label="打开AI助手"
      @mousedown="startDrag($event, 'move')"
      @touchstart="startDrag($event, 'move')"
      @click="toggleOpen"
    >
      <span class="material-symbols-outlined text-[32px]">smart_toy</span>
    </button>

    <!-- 聊天窗口 (展开状态) -->
    <div
      v-else
      class="bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up border border-slate-200 relative"
      :style="windowStyle"
    >
      <!-- Resize Handles (仅非最大化时可用) -->
      <template v-if="!isMaximized">
        <div class="resize-handle n" @mousedown.stop.prevent="startDrag($event, 'n')" @touchstart.stop.prevent="startDrag($event, 'n')"></div>
        <div class="resize-handle e" @mousedown.stop.prevent="startDrag($event, 'e')" @touchstart.stop.prevent="startDrag($event, 'e')"></div>
        <div class="resize-handle s" @mousedown.stop.prevent="startDrag($event, 's')" @touchstart.stop.prevent="startDrag($event, 's')"></div>
        <div class="resize-handle w" @mousedown.stop.prevent="startDrag($event, 'w')" @touchstart.stop.prevent="startDrag($event, 'w')"></div>
        <div class="resize-handle ne" @mousedown.stop.prevent="startDrag($event, 'ne')" @touchstart.stop.prevent="startDrag($event, 'ne')"></div>
        <div class="resize-handle se" @mousedown.stop.prevent="startDrag($event, 'se')" @touchstart.stop.prevent="startDrag($event, 'se')"></div>
        <div class="resize-handle sw" @mousedown.stop.prevent="startDrag($event, 'sw')" @touchstart.stop.prevent="startDrag($event, 'sw')"></div>
        <div class="resize-handle nw" @mousedown.stop.prevent="startDrag($event, 'nw')" @touchstart.stop.prevent="startDrag($event, 'nw')"></div>
      </template>

      <!-- 顶部区域 (可拖拽标题栏) -->
      <div 
        class="bg-blue-600 p-4 text-white shrink-0 flex items-center justify-between relative overflow-hidden select-none cursor-move"
        @mousedown="startDrag($event, 'move')"
        @touchstart="startDrag($event, 'move')"
        @dblclick="toggleMaximize"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 pointer-events-none"></div>
        
        <div class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
            <span class="material-symbols-outlined text-2xl">smart_toy</span>
          </div>
          <div>
            <h3 class="font-black tracking-wide text-lg">智能助手小爱</h3>
            <p class="text-blue-100 text-xs">随时为您解答问题</p>
          </div>
        </div>

        <div class="relative z-10 flex items-center gap-1">
          <button 
            @click.stop="toggleMaximize"
            class="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            :aria-label="isMaximized ? '还原窗口' : '最大化窗口'"
          >
            <span class="material-symbols-outlined text-xl">{{ isMaximized ? 'close_fullscreen' : 'check_box_outline_blank' }}</span>
          </button>
          <button 
            @click.stop="toggleOpen"
            class="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="最小化窗口"
          >
            <span class="material-symbols-outlined text-xl">remove</span>
          </button>
        </div>
      </div>

      <!-- 中部消息区 -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref="msgContainer">
        <div v-for="(msg, idx) in messages" :key="idx" class="flex gap-3" :class="msg.role === 'user' ? 'flex-row-reverse' : ''">
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-slate-100 shadow-sm"
            :class="msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-blue-600'"
          >
            <span class="material-symbols-outlined text-base">{{ msg.role === 'user' ? 'person' : 'smart_toy' }}</span>
          </div>
          <div 
            class="max-w-[85%] p-3 rounded-2xl text-base leading-relaxed shadow-sm break-words"
            :class="msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'"
          >
            {{ msg.content }}
          </div>
        </div>
      </div>

      <!-- 底部功能区 -->
      <div class="p-3 bg-white border-t border-slate-100 shrink-0">
        <!-- 快捷功能按钮 (响应式网格) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <button
            v-for="btn in quickActions"
            :key="btn.label"
            class="flex items-center justify-center gap-1 px-2 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors group"
            @click="handleAction(btn)"
          >
            <span class="material-symbols-outlined text-blue-600 text-lg group-hover:scale-110 transition-transform">{{ btn.icon }}</span>
            <span class="font-bold text-slate-700 text-xs group-hover:text-blue-700 truncate">{{ btn.label }}</span>
          </button>
        </div>
        
        <div class="relative">
          <input 
            v-model="inputMsg"
            @keyup.enter="sendMessage"
            type="text" 
            placeholder="请输入您的问题..." 
            class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          >
          <button 
            @click="sendMessage"
            class="absolute right-1 top-1 bottom-1 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 active:scale-95 transition-all"
            :disabled="!inputMsg.trim()"
          >
            <span class="material-symbols-outlined text-base">send</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const isOpen = ref(false)
const isMaximized = ref(false)
// 分离按钮位置和窗口位置
const floatBtnPos = ref({ x: window.innerWidth - 80, y: window.innerHeight - 100 })
const windowPos = ref({ x: window.innerWidth / 2 - 180, y: window.innerHeight / 2 - 300 })
const size = ref({ w: 360, h: 600 })
const assistantRef = ref(null)

// 拖拽与缩放状态
const interactionState = ref({
  active: false,
  type: null, // 'move', 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'
  hasMoved: false,
  startX: 0,
  startY: 0,
  startPos: { x: 0, y: 0 },
  startSize: { w: 0, h: 0 },
  target: 'window' // 'window' or 'btn'
})

const inputMsg = ref('')
const msgContainer = ref(null)

const messages = ref([
  { role: 'ai', content: '您好！我是您的智能助手小爱。有什么可以帮您的吗？' }
])

const quickActions = [
  { label: '视频通话', icon: 'videocam', reply: '视频通话很简单：\n1. 打开微信\n2. 点击联系人\n3. 点击右下角“+”号\n4. 选择“视频通话”即可' },
  { label: '找回密码', icon: 'lock_reset', reply: '请点击个人中心的“安全设置” -> “修改密码”。如果是忘记密码，请使用手机号验证码登录重置。' },
  { label: '调节字体', icon: 'format_size', reply: '调节字体大小：\n1. 进入手机“设置”\n2. 点击“显示与亮度”\n3. 选择“字体大小与粗细”进行调节' },
  { label: '紧急求助', icon: 'sos', reply: '正在为您呼叫紧急联系人...（模拟功能）\n同时已发送您的当前位置。' }
]

// 容器样式 (位置)
const containerStyle = computed(() => {
  if (isMaximized.value) {
    return {
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      transform: 'none'
    }
  }
  const currentPos = isOpen.value ? windowPos.value : floatBtnPos.value
  return {
    left: `${currentPos.x}px`,
    top: `${currentPos.y}px`,
    touchAction: 'none'
  }
})

// 窗口样式 (尺寸)
const windowStyle = computed(() => {
  if (isMaximized.value) {
    return { width: '100%', height: '100%', borderRadius: 0 }
  }
  return {
    width: `${size.value.w}px`,
    height: `${size.value.h}px`
  }
})

// 开始拖拽或缩放
const startDrag = (e, type) => {
  if (isMaximized.value && type === 'move') return // 最大化时不拖拽
  
  const target = isOpen.value ? 'window' : 'btn'
  const currentPos = target === 'window' ? windowPos.value : floatBtnPos.value

  interactionState.value = {
    active: true,
    type,
    hasMoved: false,
    startX: e.type.includes('mouse') ? e.clientX : e.touches[0].clientX,
    startY: e.type.includes('mouse') ? e.clientY : e.touches[0].clientY,
    startPos: { ...currentPos },
    startSize: { ...size.value },
    target
  }
  
  document.addEventListener('mousemove', onInteraction)
  document.addEventListener('touchmove', onInteraction, { passive: false })
  document.addEventListener('mouseup', stopInteraction)
  document.addEventListener('touchend', stopInteraction)
}

// 处理交互 (移动/缩放)
const onInteraction = (e) => {
  if (!interactionState.value.active) return
  e.preventDefault()
  
  interactionState.value.hasMoved = true
  
  const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX
  const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY
  
  const dx = clientX - interactionState.value.startX
  const dy = clientY - interactionState.value.startY
  
  if (interactionState.value.type === 'move') {
    // 移动窗口或按钮
    let newX = interactionState.value.startPos.x + dx
    let newY = interactionState.value.startPos.y + dy
    
    // 边界限制
    const currentW = isOpen.value ? size.value.w : 60
    const currentH = isOpen.value ? size.value.h : 60
    const maxX = window.innerWidth - currentW
    const maxY = window.innerHeight - currentH
    
    newX = Math.max(0, Math.min(newX, maxX))
    newY = Math.max(0, Math.min(newY, maxY))
    
    if (interactionState.value.target === 'window') {
      windowPos.value = { x: newX, y: newY }
    } else {
      floatBtnPos.value = { x: newX, y: newY }
    }
  } else {
    // 缩放窗口
    handleResize(interactionState.value.type, dx, dy)
  }
}

const handleResize = (type, dx, dy) => {
  const minW = 200, minH = 150
  const maxW = window.innerWidth * 0.9, maxH = window.innerHeight * 0.9
  
  let newW = interactionState.value.startSize.w
  let newH = interactionState.value.startSize.h
  let newX = interactionState.value.startPos.x
  let newY = interactionState.value.startPos.y
  
  // 宽度变化
  if (type.includes('e')) newW += dx
  if (type.includes('w')) {
    newW -= dx
    newX += dx
  }
  
  // 高度变化
  if (type.includes('s')) newH += dy
  if (type.includes('n')) {
    newH -= dy
    newY += dy
  }
  
  // 限制尺寸
  if (newW < minW) {
    if (type.includes('w')) newX = interactionState.value.startPos.x + (interactionState.value.startSize.w - minW)
    newW = minW
  }
  if (newW > maxW) {
    if (type.includes('w')) newX = interactionState.value.startPos.x + (interactionState.value.startSize.w - maxW)
    newW = maxW
  }
  
  if (newH < minH) {
    if (type.includes('n')) newY = interactionState.value.startPos.y + (interactionState.value.startSize.h - minH)
    newH = minH
  }
  if (newH > maxH) {
    if (type.includes('n')) newY = interactionState.value.startPos.y + (interactionState.value.startSize.h - maxH)
    newH = maxH
  }
  
  size.value = { w: newW, h: newH }
  if (type.includes('n') || type.includes('w')) {
    windowPos.value = { x: newX, y: newY }
  }
}

const stopInteraction = () => {
  interactionState.value.active = false
  document.removeEventListener('mousemove', onInteraction)
  document.removeEventListener('touchmove', onInteraction)
  document.removeEventListener('mouseup', stopInteraction)
  document.removeEventListener('touchend', stopInteraction)
  
  // 保存尺寸配置
  if (isOpen.value && !isMaximized.value) {
    localStorage.setItem('ai_assistant_size', JSON.stringify(size.value))
  }
}

const toggleOpen = () => {
  if (interactionState.value.hasMoved) return
  isOpen.value = !isOpen.value
  
  // 展开时智能调整位置，防止溢出屏幕
  if (isOpen.value) {
    nextTick(() => {
      const winW = window.innerWidth
      const winH = window.innerHeight
      const currentW = isMaximized.value ? winW : size.value.w
      const currentH = isMaximized.value ? winH : size.value.h
      
      let newX = windowPos.value.x
      let newY = windowPos.value.y
      
      if (newX + currentW > winW) newX = Math.max(0, winW - currentW - 20)
      if (newY + currentH > winH) newY = Math.max(0, winH - currentH - 20)
      
      windowPos.value = { x: newX, y: newY }
    })
  }
}

const toggleMaximize = () => {
  isMaximized.value = !isMaximized.value
}

const handleAction = (btn) => {
  messages.value.push({ role: 'user', content: `如何${btn.label}？` })
  setTimeout(() => {
    messages.value.push({ role: 'ai', content: btn.reply })
    scrollToBottom()
  }, 600)
}

const sendMessage = () => {
  if (!inputMsg.value.trim()) return
  messages.value.push({ role: 'user', content: inputMsg.value })
  inputMsg.value = ''
  
  setTimeout(() => {
    messages.value.push({ role: 'ai', content: '我已收到您的问题，正在为您查询相关信息...' })
    scrollToBottom()
  }, 1000)
}

const scrollToBottom = () => {
  if (msgContainer.value) {
    setTimeout(() => {
      msgContainer.value.scrollTop = msgContainer.value.scrollHeight
    }, 100)
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    if (isMaximized.value) {
      isMaximized.value = false
    } else {
      isOpen.value = false
    }
  }
}

onMounted(() => {
  // 恢复保存的尺寸
  const savedSize = localStorage.getItem('ai_assistant_size')
  if (savedSize) {
    try {
      size.value = JSON.parse(savedSize)
    } catch (e) { console.error(e) }
  }
  
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: center; }

/* Resize Handles */
.resize-handle { position: absolute; z-index: 50; }
.n { top: -4px; left: 0; right: 0; height: 8px; cursor: ns-resize; }
.s { bottom: -4px; left: 0; right: 0; height: 8px; cursor: ns-resize; }
.e { right: -4px; top: 0; bottom: 0; width: 8px; cursor: ew-resize; }
.w { left: -4px; top: 0; bottom: 0; width: 8px; cursor: ew-resize; }
.ne { top: -4px; right: -4px; width: 12px; height: 12px; cursor: nesw-resize; }
.nw { top: -4px; left: -4px; width: 12px; height: 12px; cursor: nwse-resize; }
.se { bottom: -4px; right: -4px; width: 12px; height: 12px; cursor: nwse-resize; }
.sw { bottom: -4px; left: -4px; width: 12px; height: 12px; cursor: nesw-resize; }
</style>
