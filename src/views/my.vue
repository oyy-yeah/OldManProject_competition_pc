<template>
  <div class="w-full bg-slate-50 min-h-screen font-sans pb-16">
    <div class="mx-auto w-full max-w-[1000px] px-4 md:px-6 py-8">
      <!-- 页面头部 -->
      <header class="mb-8">
        <h1 class="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2">
          <span class="material-symbols-outlined text-blue-600 text-3xl">account_circle</span>
          个人中心
        </h1>
        <p class="mt-2 text-slate-600">管理您的个人信息与偏好设置</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- 左侧菜单栏 -->
        <aside class="lg:col-span-3">
          <nav class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="w-full text-left px-6 py-4 flex items-center gap-3 transition-colors border-l-4"
              :class="activeTab === tab.id ? 'bg-blue-50 border-blue-600 text-blue-600 font-bold' : 'border-transparent text-slate-600 hover:bg-slate-50'"
            >
              <span class="material-symbols-outlined">{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          </nav>
        </aside>

        <!-- 右侧内容区 -->
        <main class="lg:col-span-9 space-y-6">
          <!-- 个人资料模块 -->
          <section v-if="activeTab === 'profile'" class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
            <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-slate-400">badge</span>
              基本信息
            </h2>
            
            <div class="flex flex-col md:flex-row items-start gap-8">
              <!-- 头像上传 -->
              <div class="relative group cursor-pointer" @click="triggerAvatarUpload">
                <img :src="userStore.userInfo.avatar" class="w-24 h-24 rounded-full object-cover border-2 border-slate-200 group-hover:border-blue-500 transition-colors">
                <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="material-symbols-outlined text-white">photo_camera</span>
                </div>
                <input type="file" ref="avatarInput" class="hidden" accept="image/*" @change="onAvatarChange">
              </div>

              <div class="flex-1 w-full space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">昵称</label>
                  <div class="flex gap-2">
                    <input 
                      v-model="editForm.name" 
                      type="text" 
                      class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      :disabled="!isEditing"
                    >
                    <button 
                      v-if="!isEditing"
                      @click="isEditing = true"
                      class="px-4 py-2 text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-colors"
                    >
                      编辑
                    </button>
                    <div v-else class="flex gap-2">
                      <button 
                        @click="saveProfile"
                        class="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all"
                        :disabled="loading"
                      >
                        {{ loading ? '保存中...' : '保存' }}
                      </button>
                      <button 
                        @click="cancelEdit"
                        class="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-1">账号 ID</label>
                  <div class="text-slate-500 px-4 py-2 bg-slate-50 rounded-xl border border-transparent">
                    {{ userStore.userInfo.id }}
                  </div>
                </div>
              </div>
            </div>

            <hr class="my-8 border-slate-100">

            <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-slate-400">lock</span>
              安全设置
            </h2>

            <form @submit.prevent="changePassword" class="max-w-md space-y-4">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">原密码</label>
                <input v-model="pwdForm.old" type="password" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-1">新密码</label>
                <input v-model="pwdForm.new" type="password" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              </div>
              <button 
                type="submit" 
                class="px-6 py-2 bg-slate-800 text-white font-bold rounded-xl shadow-md hover:bg-slate-900 active:scale-95 transition-all"
                :disabled="!pwdForm.old || !pwdForm.new"
              >
                修改密码
              </button>
            </form>
          </section>

          <!-- 设置模块 -->
          <section v-if="activeTab === 'settings'" class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 animate-fade-in space-y-8">
            <div>
              <h2 class="text-xl font-bold text-slate-900 mb-4">隐私设置</h2>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <div class="font-bold text-slate-900">账号可见性</div>
                    <div class="text-xs text-slate-500">允许其他用户通过搜索找到我</div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="settings.publicProfile" class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <div class="font-bold text-slate-900">数据分享</div>
                    <div class="text-xs text-slate-500">允许平台分析我的学习数据以推荐课程</div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="settings.dataShare" class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h2 class="text-xl font-bold text-slate-900 mb-4">系统设置</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div class="font-bold text-slate-900 mb-2">显示模式</div>
                  <select v-model="settings.theme" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm">
                    <option value="light">☀️ 白天模式</option>
                    <option value="dark">🌙 夜间模式</option>
                    <option value="auto">🤖 跟随系统</option>
                  </select>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div class="font-bold text-slate-900 mb-2">语言偏好</div>
                  <select v-model="settings.lang" class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm">
                    <option value="zh-CN">🇨🇳 简体中文</option>
                    <option value="en-US">🇺🇸 English</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 class="text-xl font-bold text-slate-900 mb-4">账号操作</h2>
              <button 
                @click="handleLogout"
                class="w-full bg-rose-50 text-rose-600 border border-rose-200 font-bold py-4 rounded-xl hover:bg-rose-100 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span class="material-symbols-outlined">logout</span>
                退出登录
              </button>
            </div>
          </section>

          <!-- 消息与反馈模块 -->
          <section v-if="activeTab === 'notifications'" class="space-y-6 animate-fade-in">
            <!-- 消息通知 -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 class="text-xl font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>消息中心</span>
                <span v-if="unreadCount > 0" class="bg-rose-500 text-white text-xs px-2 py-1 rounded-full">{{ unreadCount }} 未读</span>
              </h2>
              <div class="space-y-4">
                <div v-for="msg in notifications" :key="msg.id" class="flex gap-4 p-4 rounded-xl transition-colors" :class="msg.read ? 'bg-slate-50 opacity-70' : 'bg-blue-50/50 border border-blue-100'">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" :class="msg.read ? 'bg-slate-200 text-slate-500' : 'bg-blue-100 text-blue-600'">
                    <span class="material-symbols-outlined">{{ msg.icon }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <h4 class="font-bold text-slate-900">{{ msg.title }}</h4>
                      <span class="text-xs text-slate-500">{{ msg.time }}</span>
                    </div>
                    <p class="text-slate-600 text-sm mt-1">{{ msg.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 帮助反馈 -->
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 class="text-xl font-bold text-slate-900 mb-4">帮助与反馈</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button class="p-4 bg-slate-50 rounded-xl text-center hover:bg-slate-100 transition-colors">
                  <span class="material-symbols-outlined text-3xl text-blue-600 mb-2">quiz</span>
                  <div class="font-bold text-slate-900">常见问题</div>
                </button>
                <button class="p-4 bg-slate-50 rounded-xl text-center hover:bg-slate-100 transition-colors">
                  <span class="material-symbols-outlined text-3xl text-emerald-600 mb-2">support_agent</span>
                  <div class="font-bold text-slate-900">联系客服</div>
                </button>
                <button class="p-4 bg-slate-50 rounded-xl text-center hover:bg-slate-100 transition-colors">
                  <span class="material-symbols-outlined text-3xl text-amber-600 mb-2">rate_review</span>
                  <div class="font-bold text-slate-900">意见反馈</div>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>

    <!-- 全局提示 Toast -->
    <div v-if="toast.show" class="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-fade-in z-50">
      <span class="material-symbols-outlined text-emerald-400">check_circle</span>
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userStore } from '../store/userStore'

const router = useRouter()
const activeTab = ref('profile')
const loading = ref(false)
const isEditing = ref(false)
const avatarInput = ref(null)

const tabs = [
  { id: 'profile', label: '个人资料', icon: 'face' },
  { id: 'settings', label: '设置', icon: 'settings' },
  { id: 'notifications', label: '消息与帮助', icon: 'notifications' }
]

const editForm = ref({ name: userStore.userInfo.name })
const pwdForm = ref({ old: '', new: '' })

const settings = ref({
  publicProfile: true,
  dataShare: false,
  theme: 'light',
  lang: 'zh-CN'
})

const notifications = ref([
  { id: 1, title: '兑换成功', content: '您的"无糖燕麦片"已发货，请注意查收。', time: '10分钟前', icon: 'redeem', read: false },
  { id: 2, title: '课程更新', content: '您关注的"手机摄影进阶"已更新第5课。', time: '2小时前', icon: 'school', read: true },
  { id: 3, title: '系统通知', content: '您的账户安全评分已更新。', time: '1天前', icon: 'security', read: true }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const toast = ref({ show: false, message: '' })

const showToast = (msg) => {
  toast.value = { show: true, message: msg }
  setTimeout(() => { toast.value.show = false }, 3000)
}

const triggerAvatarUpload = () => {
  avatarInput.value.click()
}

const onAvatarChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userStore.updateAvatar(e.target.result)
      showToast('头像修改成功')
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = () => {
  loading.value = true
  setTimeout(() => {
    userStore.userInfo.name = editForm.value.name
    isEditing.value = false
    loading.value = false
    showToast('个人信息已更新')
  }, 800)
}

const cancelEdit = () => {
  editForm.value.name = userStore.userInfo.name
  isEditing.value = false
}

const changePassword = () => {
  if (pwdForm.value.old === '123456') { // 模拟验证
    showToast('密码修改成功，请重新登录')
    pwdForm.value = { old: '', new: '' }
  } else {
    alert('原密码错误（测试密码：123456）')
  }
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.replace('/')
    // 由于跳转后页面会刷新或重置，这里的 showToast 可能不会显示在首页
    // 如果需要跨页显示 Toast，通常需要全局事件总线或 Store 状态，这里简单处理
    setTimeout(() => alert('已安全退出'), 100) 
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
</style>
