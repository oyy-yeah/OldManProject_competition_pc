<template>
  <div class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
    <div class="flex gap-4">
      <img :src="userStore.userInfo.avatar" alt="我" class="w-10 h-10 rounded-full object-cover">
      <div class="flex-1">
        <textarea 
          v-model="content"
          placeholder="分享您的生活点滴..." 
          class="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700"
        ></textarea>
        
        <!-- 标签展示区 -->
        <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mt-2">
          <span 
            v-for="tag in selectedTags" 
            :key="tag"
            class="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-md flex items-center gap-1"
          >
            # {{ tag }}
            <button @click="removeTag(tag)" class="hover:text-blue-800">×</button>
          </span>
        </div>

        <div class="flex items-center justify-between mt-3">
          <div class="flex gap-2">
            <button class="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative group" title="添加图片">
              <span class="material-symbols-outlined">image</span>
              <!-- 模拟文件上传点击 -->
              <input type="file" class="absolute inset-0 opacity-0 cursor-pointer" @change="onFileSelect" accept="image/*" multiple>
            </button>
            <button 
              class="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative" 
              title="添加标签"
              @click="showTagSelector = !showTagSelector"
            >
              <span class="material-symbols-outlined">tag</span>
              
              <!-- 简易标签选择器 -->
              <div v-if="showTagSelector" class="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-10">
                <div class="text-xs font-bold text-slate-500 mb-2 px-2">热门标签</div>
                <div class="flex flex-wrap gap-1">
                  <button 
                    v-for="tag in availableTags" 
                    :key="tag"
                    @click="addTag(tag)"
                    class="px-2 py-1 hover:bg-slate-100 rounded text-xs text-slate-700 w-full text-left"
                  >
                    # {{ tag }}
                  </button>
                </div>
              </div>
            </button>
          </div>
          
          <button 
            @click="publish"
            :disabled="!content.trim() && selectedImages.length === 0"
            class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            发布
          </button>
        </div>
        
        <!-- 图片预览 -->
        <div v-if="selectedImages.length > 0" class="mt-3 grid grid-cols-3 gap-2">
          <div v-for="(img, idx) in selectedImages" :key="idx" class="relative aspect-square rounded-lg overflow-hidden group">
            <img :src="img" class="w-full h-full object-cover">
            <button 
              @click="removeImage(idx)"
              class="absolute top-1 right-1 bg-black/50 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { userStore } from '../../store/userStore'

const emit = defineEmits(['publish'])

const content = ref('')
const selectedTags = ref([])
const selectedImages = ref([])
const showTagSelector = ref(false)

const availableTags = ['健康养生', '美食分享', '退休生活', '书法绘画', '广场舞', '旅游打卡']

const addTag = (tag) => {
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
  }
  showTagSelector.value = false
}

const removeTag = (tag) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

const onFileSelect = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImages.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  selectedImages.value.splice(index, 1)
}

const publish = () => {
  if (!content.value.trim() && selectedImages.value.length === 0) return
  
  emit('publish', {
    content: content.value,
    tags: selectedTags.value,
    images: selectedImages.value
  })
  
  // Reset
  content.value = ''
  selectedTags.value = []
  selectedImages.value = []
}
</script>
