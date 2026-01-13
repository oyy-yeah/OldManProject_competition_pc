<template>
  <div class="bg-white p-5 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
    <!-- 头部用户信息 -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-3">
        <img :src="post.user.avatar" :alt="post.user.name" class="w-10 h-10 rounded-full object-cover">
        <div>
          <div class="font-bold text-slate-900">{{ post.user.name }}</div>
          <div class="text-xs text-slate-500">{{ post.user.time }}</div>
        </div>
      </div>
      <button class="text-slate-400 hover:text-slate-600">
        <span class="material-symbols-outlined">more_horiz</span>
      </button>
    </div>

    <!-- 内容主体 -->
    <div class="mb-3">
      <p class="text-slate-800 leading-relaxed text-base">{{ post.content }}</p>
      
      <!-- 标签 -->
      <div v-if="post.tags && post.tags.length" class="flex flex-wrap gap-2 mt-2">
        <span v-for="tag in post.tags" :key="tag" class="text-blue-600 text-sm font-bold hover:underline cursor-pointer">
          # {{ tag }}
        </span>
      </div>

      <!-- 图片网格 -->
      <div v-if="post.images && post.images.length" class="mt-3 grid gap-2" :class="gridClass">
        <div v-for="(img, idx) in post.images" :key="idx" class="relative rounded-lg overflow-hidden bg-slate-100" :class="idx === 0 && post.images.length === 3 ? 'row-span-2' : 'aspect-square'">
          <img :src="img" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-zoom-in">
        </div>
      </div>
    </div>

    <!-- 底部互动栏 -->
    <div class="flex items-center justify-between pt-3 border-t border-slate-50">
      <div class="flex gap-6">
        <button 
          @click="$emit('like', post.id)" 
          class="flex items-center gap-1.5 text-sm font-bold transition-colors group"
          :class="post.isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'"
        >
          <span class="material-symbols-outlined text-[20px] group-active:scale-125 transition-transform" :class="post.isLiked ? 'filled' : ''">favorite</span>
          <span>{{ post.likes || '赞' }}</span>
        </button>
        
        <button 
          @click="showCommentInput = !showCommentInput"
          class="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <span class="material-symbols-outlined text-[20px]">chat_bubble</span>
          <span>{{ post.comments?.length || '评论' }}</span>
        </button>
        
        <button class="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-green-600 transition-colors">
          <span class="material-symbols-outlined text-[20px]">share</span>
          <span>分享</span>
        </button>
      </div>
    </div>

    <!-- 评论区 -->
    <div v-if="showCommentInput || (post.comments && post.comments.length > 0)" class="mt-4 bg-slate-50 rounded-xl p-3">
      <!-- 评论列表 -->
      <div v-if="post.comments && post.comments.length > 0" class="space-y-3 mb-3">
        <div v-for="comment in post.comments" :key="comment.id" class="flex gap-2 items-start">
          <span class="font-bold text-slate-900 text-sm whitespace-nowrap">{{ comment.user }}:</span>
          <span class="text-slate-700 text-sm">{{ comment.content }}</span>
        </div>
      </div>

      <!-- 输入框 -->
      <div v-if="showCommentInput" class="flex gap-2">
        <input 
          v-model="commentText"
          type="text" 
          placeholder="写下您的评论..." 
          class="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="submitComment"
        >
        <button 
          @click="submitComment"
          :disabled="!commentText.trim()"
          class="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-lg disabled:opacity-50"
        >
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['like', 'comment'])

const showCommentInput = ref(false)
const commentText = ref('')

const gridClass = computed(() => {
  const len = props.post.images?.length || 0
  if (len === 1) return 'grid-cols-1'
  if (len === 2) return 'grid-cols-2'
  if (len === 3) return 'grid-cols-2'
  return 'grid-cols-3'
})

const submitComment = () => {
  if (!commentText.value.trim()) return
  emit('comment', props.post.id, commentText.value)
  commentText.value = ''
}
</script>

<style scoped>
.material-symbols-outlined.filled {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
