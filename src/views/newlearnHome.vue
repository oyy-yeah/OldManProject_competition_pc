<template>
  <div class="w-full bg-white text-slate-900">
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
            <div class="text-[16px] font-bold text-slate-900 bd-2 ">{{ user.name }}</div>
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

    <nav class="w-full bg-blue-600 text-white h-[56px] box-border overflow-hidden" aria-label="主导航">
      <div class="mx-auto w-full h-full max-w-[1200px] px-4 md:px-6">
        <div class="flex h-full items-center justify-center gap-10 overflow-x-auto overflow-y-hidden whitespace-nowrap">
          <RouterLink
            v-for="item in navItems"
            :key="item.id"
            :to="item.to"
            class="flex h-full items-center gap-2 leading-none transition-all duration-300 ease-out border-b-2 pb-2"
            :class="isActiveRoute(item.to) ? 'text-white font-semibold text-[20px] border-white' : 'text-white/90 text-[14px] border-transparent'"
            :aria-current="isActiveRoute(item.to) ? 'page' : undefined"
          >
            <span
              class="material-symbols-outlined transition-all duration-300 ease-out"
              :class="isActiveRoute(item.to) ? 'text-[22px]' : 'text-[18px]'"
            >
              {{ item.icon }}
            </span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </div>
      </div>
    </nav>

    <section class="relative w-full">
      <div class="mx-auto w-full max-w-[1200px] px-4 md:px-6">
       
      </div>

      <div class="relative mt-8 h-[520px] w-full bg-cover bg-center" :style="{ backgroundImage: `url(${heroUrl})` }">
        <div class="relative mx-auto h-full w-full max-w-[1200px] px-4 md:px-6">
          <div class="grid h-full grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div class="lg:col-span-7">
              <div class="max-w-xl">
                <div class="text-white text-4xl md:text-5xl font-black tracking-wide">学习充实生活</div>
                <div class="mt-3 text-white/90 text-xl md:text-2xl font-medium italic">Learning is life</div>
              </div>
            </div>

            <div class="lg:col-span-5">
              <div v-if="!userStore.isLoggedIn" class="mx-auto w-full max-w-[360px] bg-white p-8 shadow-xl nlh-rounded">
                <div class="text-center">
                  <div class="text-3xl font-black text-blue-600">注册</div>
                  <div class="mt-2 text-lg font-semibold text-slate-700">欢迎来到银发学习平台</div>
                </div>

                <div class="mt-6">
                  <label class="sr-only" for="email">请输入您的邮箱地址</label>
                  <input
                    id="email"
                    v-model="email"
                    class="w-full border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-[#d21034]"
                    inputmode="email"
                    placeholder="请输入您的邮箱地址"
                    type="email"
                    maxlength="11"
                  />
                </div>
                

                <div class="mt-4">
                  <label class="sr-only" for="code">请输入验证码</label>
                  <div class="flex gap-2">
                    <input
                      id="code"
                      v-model="verifyCode"
                      class="flex-1 border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-[#d21034]"
                      placeholder="请输入验证码"
                      type="text"
                      maxlength="4"
                    />
                    <button 
                      class="w-28 bg-slate-100 text-slate-600 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-slate-200"
                      :disabled="countdown > 0"
                      @click="getVerifyCode"
                    >
                      {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                    </button>
                  </div>
                </div>

                <div v-if="errorMsg" class="mt-2 text-xs text-red-500 font-bold flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">error</span>
                  {{ errorMsg }}
                </div>

                <button 
                  class="mt-6 w-full bg-blue-600 text-white font-bold py-3 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  @click="handleRegister"
                  :disabled="isSuccess || isLoading"
                >
                  <span v-if="isLoading" class="material-symbols-outlined animate-spin">progress_activity</span>
                  <span v-else-if="isSuccess" class="material-symbols-outlined animate-bounce">check_circle</span>
                  {{ isLoading ? '注册中...' : (isSuccess ? '注册成功' : '立即注册') }}
                </button>

                <div v-if="isSuccess" class="mt-4 text-center text-emerald-600 font-bold animate-fade-in">
                  欢迎来到学习平台，即将跳转...
                </div>
                <div v-else class="mt-4 text-center text-xs text-slate-500">我们将保护好您的隐私</div>
              </div>

              <!-- 已登录状态显示 -->
              <div v-else class="mx-auto w-full max-w-[360px] bg-white p-8 shadow-xl nlh-rounded flex flex-col items-center text-center animate-fade-in">
                <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 mb-4 shadow-sm">
                  <img :src="userStore.userInfo.avatar" alt="User Avatar" class="w-full h-full object-cover">
                </div>
                <div class="text-2xl font-black text-slate-800 mb-2">欢迎回来</div>
                <div class="text-xl font-bold text-blue-600 mb-6">{{ userStore.userInfo.name }}</div>
                
                <button 
                  @click="router.push('/my')"
                  class="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined">person</span>
                  进入个人中心
                </button>
                
                <button 
                  @click="router.push('/course')"
                  class="mt-3 w-full bg-white text-slate-700 border-2 border-slate-200 font-bold py-3 rounded-xl hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined">menu_book</span>
                  继续学习
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        <button class="w-20 bg-white shadow-lg px-3 py-4 flex flex-col items-center gap-2 nlh-rounded">
          <span class="material-symbols-outlined text-blue-600">chat</span>
          <span class="text-xs text-slate-700">立即咨询</span>
        </button>
        <!-- <button class="w-20 bg-white shadow-lg px-3 py-4 flex flex-col items-center gap-2 nlh-rounded">
          <span class="material-symbols-outlined text-[#d21034]">apps</span>
          <span class="text-xs text-slate-700">下载APP</span>
        </button> -->
        <button class="w-20 bg-white shadow-lg px-3 py-4 flex flex-col items-center gap-2 nlh-rounded">
          <span class="material-symbols-outlined text-blue-600">call</span>
          <span class="text-xs text-slate-700">电话咨询</span>
        </button>
      </div>
    </section>

    <section class="mx-auto w-full max-w-[1200px] px-4 md:px-6 py-14">
      <div class="flex items-end justify-between gap-6">
        <div>
          <div class="text-2xl font-black">热门课程推荐</div>
          <div class="mt-2 text-slate-500">更适合长辈的学习内容与节奏</div>
        </div>
        <a class="text-blue-600 font-bold" href="#">查看全部>></a>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div
          v-for="course in courses"
          :key="course.id"
          class="border border-slate-200 bg-white shadow-sm nlh-rounded overflow-hidden"
        >
          <div
            class="h-40 bg-cover bg-center"
            :style="{ backgroundImage: `url(${course.image})` }"
          ></div>
          <div class="p-5">
            <div class="font-extrabold">{{ course.title }}</div>
            <div class="mt-1 text-sm text-slate-500">{{ course.desc }}</div>
            <button
              class="mt-4 w-full bg-blue-600 text-white font-bold py-3 active:scale-95 transition-transform"
              @click="goToCourse(course.id)"
            >
              开始学习
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { userStore } from '../store/userStore'

const navItems = [
  { id: 'home', label: '首页', icon: 'home', to: '/' },
  { id: 'courses', label: '优质课程', icon: 'menu_book', to: '/course' },
  { id: 'discover', label: '发现', icon: 'travel_explore', to: '/discover' },
  { id: 'community', label: '社区', icon: 'groups', to: '/community' },
  { id: 'store', label: '商店', icon: 'store', to: '/store' }
]



const route = useRoute()
const isActiveRoute = (to) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

const router = useRouter()
const goToCourse = (id) => {
  router.push({ name: 'Course', params: { id } })
}

const onAvatarClick = () => {
  router.push('/my')
}

const user = {
  name: '王阿姨',
  birthday: '1月1日'
}

const heroUrl = './assets/learnHome_img/首页.jpg'
const courses = ref([
  {
    id: 'c-1',
    title: '手机摄影入门',
    desc: '轻松拍出更好看的照片',
    image: ''
  },
  {
    id: 'c-2',
    title: '电脑操作基础',
    desc: '从零学会常用操作',
      image: ''
  },
  {
    id: 'c-3',
    title: '健康养生课堂',
    desc: '每天进步一点点',
     image: ''
  },
 
])

// 注册逻辑状态
const email = ref('')
const verifyCode = ref('')
const countdown = ref(0)
const errorMsg = ref('')
const isSuccess = ref(false)
const isLoading = ref(false)

const getVerifyCode = () => {
  if (countdown.value > 0) return
  // 邮箱验证逻辑优化 (符合 RFC 5322 标准)
  // 1. 长度检查
  if (email.value.length > 254) {
    errorMsg.value = '邮箱长度超出限制'
    return
  }
  const parts = email.value.split('@')
  if (parts.length !== 2) {
    errorMsg.value = '邮箱格式错误'
    return
  }
  if (parts[0].length > 64) {
    errorMsg.value = '邮箱本地部分长度超出限制'
    return
  }

  // 2. 格式检查
  // 支持: a@b.c (最短), user.name+tag@example.co.uk (多级子域名), 特殊字符
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  
  if (!emailRegex.test(email.value)) {
    errorMsg.value = '请输入有效的邮箱地址'
    return
  }
  errorMsg.value = ''
  // 模拟发送请求
  console.log(`Sending code to ${email.value}`)
  alert(`验证码已发送至 ${email.value}，请注意查收（测试码：0000）`)
  
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) clearInterval(timer)
  }, 1000)
}

const handleRegister = () => {
  if (isSuccess.value || isLoading.value) return
  
  if (email.value !== 'test@qq.com' || verifyCode.value !== '0000') {
    errorMsg.value = '邮箱或验证码错误（测试：test@qq.com / 0000）'  
    return
  }
  
  errorMsg.value = ''
  isLoading.value = true
  
  // 模拟注册请求
  setTimeout(() => {
    isLoading.value = false
    isSuccess.value = true
    userStore.resetSurveyStatus() // 重置问卷状态，确保新用户能进入问卷
    
    setTimeout(() => {
      router.push('/survey')
    }, 1500)
  }, 1000)
}

// 作为 Vue-Router 的“首页”组件，只需在路由表中把 path: '/' 对应的 component 指向本文件即可。
// 若使用自动导入（vite-plugin-pages 等），保持文件名为 index.vue 或 pages/index.vue 即可被识别为“/”路由。
// 无需额外修改组件内部，保留原有 <script setup> 即可。
</script>

<style scoped>
.nlh-rounded { border-radius: 14px !important; }
.nlh-pill { border-radius: 9999px !important; }
</style>
