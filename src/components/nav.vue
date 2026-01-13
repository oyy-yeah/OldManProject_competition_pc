<template>
  <header class="w-full bg-white">
    <div class="mx-auto w-full max-w-[1200px] px-4 md:px-6">
      <div class="flex items-center justify-between py-4">
        <div class="flex items-center gap-3">
          <div class="size-10 bg-blue-600 text-white flex items-center justify-center nlh-rounded">
            <span class="material-symbols-outlined">school</span>
          </div>
          <div class="leading-tight">
            <div class="text-lg md:text-xl font-extrabold tracking-wide bg-white ">银发学习平台</div>
            <div class="text-xs">欢迎来到银发学习平台</div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="hidden sm:flex flex-col items-end leading-tight">
            <div class="text-[16px] font-bold text-slate-900">{{ user.name }}</div>
            <div class="text-[14px] text-slate-600">生日：{{ user.birthday }}</div>
          </div>
          <button
            type="button"
            class="w-[60px] h-[60px] aspect-square rounded-full overflow-hidden bg-white shadow-lg ring-1 ring-slate-200 inline-flex items-center justify-center text-slate-500 transition-transform duration-200 ease-out hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            aria-label="打开用户菜单"
            @click="onAvatarClick"
          >
            <span class="material-symbols-outlined text-[28px]">person</span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <nav class="w-full bg-blue-600 text-white h-[56px] box-border overflow-hidden">
    <div class="mx-auto w-full h-full max-w-[1200px] px-4 md:px-6">
      <div class="flex h-full items-center justify-center gap-10 overflow-x-auto overflow-y-hidden whitespace-nowrap">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="flex h-full items-center gap-2 leading-none transition-all duration-300 ease-out"
          :class="
            activeNavId === item.id
              ? 'text-white font-semibold text-[20px] border-b-2 border-orange-600 pb-2'
              : 'text-white/90 text-[14px] border-b-2 border-transparent pb-2'
          "
          @click="setActiveNav(item.id)"
        >
          <span
            class="material-symbols-outlined transition-all duration-300 ease-out"
            :class="activeNavId === item.id ? 'text-[22px]' : 'text-[18px]'"
          >
            {{ item.icon }}
          </span>
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const navItems = [
  { id: 'home', label: '首页', icon: 'home' },
  { id: 'courses', label: '优质课程', icon: 'menu_book' },
  { id: 'discover', label: '发现', icon: 'travel_explore' },
  { id: 'community', label: '社区', icon: 'groups' },
  { id: 'store', label: '商店', icon: 'store' }
]

const router = useRouter()
const route = useRoute()

const getActiveNavIdFromPath = (path) => {
  if (path === '/course') return 'courses'
  return 'home'
}

const activeNavId = ref(getActiveNavIdFromPath(route.path))

const user = {
  name: '王阿姨',
  birthday: '1.1'
}

const setActiveNav = (id) => {
  activeNavId.value = id
  if (id === 'home') router.push('/')
  if (id === 'courses') router.push('/course')
}

watch(
  () => route.path,
  (path) => {
    activeNavId.value = getActiveNavIdFromPath(path)
  }
)

const onAvatarClick = () => {}
</script>

<style scoped>
.nlh-rounded { border-radius: 14px !important; }
</style>
