<template>
  <header class="nav-shell" :class="isCompact ? 'nav-shell--compact' : 'nav-shell--expanded'">
    <div class="max-w-[1280px] mx-auto flex items-center justify-between px-6 lg:px-20" :class="isCompact ? 'py-2' : 'py-4'">
      <div class="flex items-center gap-10">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-bold leading-tight tracking-tight">银发有学</h2>
        </div>
        <nav class="hidden md:flex items-center gap-8">
          <a class="flex items-center gap-2 text-primary font-bold border-b-2 border-primary pb-1" href="#">
            <span class="material-symbols-outlined">home</span> 首页
          </a>
          <a class="flex items-center gap-2 text-[#4c739a] dark:text-slate-400 font-medium hover:text-primary transition-colors" href="#">
            <span class="material-symbols-outlined">school</span> 课程
          </a>
          <a class="flex items-center gap-2 text-[#4c739a] dark:text-slate-400 font-medium hover:text-primary transition-colors" href="#">
            <span class="material-symbols-outlined">group</span> 社区
          </a>
          <a class="flex items-center gap-2 text-[#4c739a] dark:text-slate-400 font-medium hover:text-primary transition-colors" href="#">
            <span class="material-symbols-outlined">shopping_bag</span> 商店
          </a>
        </nav>
      </div>
      <div class="flex items-center gap-6">
        <div class="hidden sm:flex items-center bg-[#f0f0ff] px-4 w-64" :class="isCompact ? 'py-1.5' : 'py-2'">
          <span class="material-symbols-outlined text-[#4c739a] mr-2 text-sm">搜索</span>
          <input class="bg-transparent border-none focus:ring-0 text-base w-full" type="text" />
        </div>
        <div class="flex items-center gap-4">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-bold">王阿姨</p>
            <p class="text-xs text-accent-green font-bold">1,240分</p>
          </div>
          <div class="avatar border-2 border-primary" :class="isCompact ? 'size-10' : 'size-12'" :style="{ backgroundImage: `url(${userAvatarUrl})` }">
            <img class="avatar__img" :src="userAvatarUrl" alt="用户头像" />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const isCompact = ref(false)
const userAvatarUrl = new URL('../../assets/user.png', import.meta.url).href

const updateCompactState = () => {
  isCompact.value = window.scrollY > 12
}

onMounted(() => {
  updateCompactState()
  window.addEventListener('scroll', updateCompactState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateCompactState)
})
</script>

<style scoped>
.nav-shell {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  margin: 0;
  border-bottom: 1px solid #e7edf3;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: background-color 160ms ease, box-shadow 160ms ease;
}

.nav-shell--expanded {
  background-color: rgba(255, 255, 255, 0.92);
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
}

.nav-shell--compact {
  background-color: rgba(255, 255, 255, 0.86);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
}

.avatar {
  border-radius: 50% !important;
  overflow: hidden;
  background-size: cover;
  background-position: center;
}

.avatar__img {
  width: 100%;
  height: 100%;
  object-position: center;
  display: none;
}

@supports (object-fit: cover) {
  .avatar__img {
    display: block;
    object-fit: cover;
  }
}
</style>
