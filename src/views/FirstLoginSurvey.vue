<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
    <div class="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      <!-- 顶部进度条 -->
      <div class="bg-slate-100 h-2 w-full">
        <div 
          class="h-full bg-blue-600 transition-all duration-500 ease-out"
          :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
        ></div>
      </div>

      <!-- 头部 -->
      <header class="p-8 bg-blue-600 text-white flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-black tracking-wide mb-2">欢迎加入大家庭</h1>
          <p class="text-blue-100 text-lg">请告诉我们要怎么称呼您，让我们为您提供更好的服务</p>
        </div>
        <button 
          @click="toggleSpeech" 
          class="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          :aria-label="isSpeechEnabled ? '关闭语音朗读' : '开启语音朗读'"
        >
          <span class="material-symbols-outlined text-3xl">{{ isSpeechEnabled ? 'volume_up' : 'volume_off' }}</span>
        </button>
      </header>

      <!-- 内容区域 -->
      <div class="p-8 md:p-10 min-h-[400px]">
        <!-- 步骤 1: 基本信息 -->
        <section v-if="currentStep === 1" class="space-y-8 animate-fade-in">
          <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-600 text-3xl">person</span>
            第一步：基本信息
          </h2>
          
          <div class="space-y-6">
            <div>
              <label class="block text-xl font-bold text-slate-700 mb-3">您希望我们怎么称呼您？(可选)</label>
              <input 
                v-model="formData.name"
                type="text" 
                placeholder="例如：王阿姨、张老师" 
                class="w-full text-xl p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                @focus="speak('您希望我们怎么称呼您？')"
              >
            </div>

            <div>
              <label class="block text-xl font-bold text-slate-700 mb-3">您的年龄段是？</label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  v-for="age in ageOptions" 
                  :key="age"
                  @click="formData.ageRange = age; speak(`选择了${age}`)"
                  class="p-4 text-xl font-bold rounded-xl border-2 transition-all text-center"
                  :class="formData.ageRange === age ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-blue-300'"
                >
                  {{ age }}
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xl font-bold text-slate-700 mb-3">联系电话 (可选)</label>
              <input 
                v-model="formData.phone"
                type="tel" 
                placeholder="方便我们需要时联系您" 
                class="w-full text-xl p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                @focus="speak('联系电话，可选填')"
              >
            </div>
          </div>
        </section>

        <!-- 步骤 2: 学习偏好 -->
        <section v-if="currentStep === 2" class="space-y-8 animate-fade-in">
          <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-600 text-3xl">school</span>
            第二步：学习偏好
          </h2>

          <div class="space-y-6">
            <div>
              <label class="block text-xl font-bold text-slate-700 mb-3">您对哪些内容感兴趣？(多选)</label>
              <div class="grid grid-cols-2 gap-4">
                <button 
                  v-for="interest in interestOptions" 
                  :key="interest"
                  @click="toggleInterest(interest)"
                  class="p-4 text-lg font-bold rounded-xl border-2 transition-all text-left flex items-center justify-between"
                  :class="formData.interests.includes(interest) ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-600 hover:border-emerald-300'"
                >
                  {{ interest }}
                  <span v-if="formData.interests.includes(interest)" class="material-symbols-outlined">check_circle</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xl font-bold text-slate-700 mb-3">您常用的设备是？</label>
              <select 
                v-model="formData.device" 
                class="w-full text-xl p-4 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none bg-white"
                @change="speak(`选择了${formData.device}`)"
              >
                <option value="" disabled>请点击选择</option>
                <option v-for="dev in deviceOptions" :key="dev" :value="dev">{{ dev }}</option>
              </select>
            </div>
          </div>
        </section>

        <!-- 步骤 3: 账户安全 -->
        <section v-if="currentStep === 3" class="space-y-8 animate-fade-in">
          <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span class="material-symbols-outlined text-rose-600 text-3xl">security</span>
            第三步：账户安全
          </h2>

          <div class="space-y-6">
            <div>
              <label class="block text-xl font-bold text-slate-700 mb-3">设置登录密码 (6-12位数字)</label>
              <input 
                v-model="formData.password"
                type="password" 
                placeholder="例如：123456" 
                maxlength="12"
                class="w-full text-xl p-4 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors"
                @focus="speak('请设置6到12位数字密码')"
              >
            </div>

            <div>
              <label class="block text-xl font-bold text-slate-700 mb-3">密码提示问题</label>
              <select 
                v-model="formData.securityQuestion" 
                class="w-full text-xl p-4 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none bg-white mb-3"
              >
                <option value="" disabled>选择一个问题</option>
                <option v-for="q in securityQuestions" :key="q" :value="q">{{ q }}</option>
              </select>
              <input 
                v-if="formData.securityQuestion"
                v-model="formData.securityAnswer"
                type="text" 
                placeholder="请输入答案" 
                class="w-full text-xl p-4 border-2 border-slate-200 rounded-xl focus:border-rose-500 focus:outline-none transition-colors"
              >
            </div>
          </div>
        </section>
      </div>

      <!-- 底部按钮 -->
      <footer class="p-8 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
        <button 
          v-if="currentStep > 1"
          @click="prevStep"
          class="px-8 py-4 text-xl font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
        >
          上一步
        </button>
        <div v-else></div> <!-- 占位 -->

        <button 
          @click="nextStep"
          class="px-10 py-4 text-xl font-bold text-white rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
          :class="(canProceed && !isLoading) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed'"
          :disabled="!canProceed || isLoading"
        >
          <span v-if="isLoading" class="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
          <span v-else class="material-symbols-outlined text-2xl">{{ currentStep === totalSteps ? 'check' : 'arrow_forward' }}</span>
          {{ isLoading ? '保存中...' : (currentStep === totalSteps ? '完成设置' : '下一步') }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userStore } from '../store/userStore'

const router = useRouter()
const currentStep = ref(1)
const totalSteps = 3
const isSpeechEnabled = ref(false)
const isLoading = ref(false)

onMounted(() => {
  if (userStore.userInfo.isSurveyCompleted) {
    router.replace('/')
  }
})

const formData = ref({
  name: '',
  ageRange: '',
  phone: '',
  interests: [],
  device: '',
  studyTime: '',
  password: '',
  securityQuestion: '',
  securityAnswer: ''
})

const ageOptions = ['60-65岁', '66-70岁', '71岁以上']
const interestOptions = ['健康养生', '智能手机使用', '金融理财', '文化艺术', '园艺种植', '烹饪美食']
const deviceOptions = ['智能手机', '平板电脑', '台式电脑', '智能电视']
const securityQuestions = ['我的出生地是？', '我最喜欢的食物是？', '我的小学名字是？']

const canProceed = computed(() => {
  if (currentStep.value === 1) return formData.value.ageRange
  if (currentStep.value === 2) return formData.value.interests.length > 0 && formData.value.device
  if (currentStep.value === 3) return /^\d{6,12}$/.test(formData.value.password) && formData.value.securityQuestion && formData.value.securityAnswer
  return false
})

const speak = (text) => {
  if (!isSpeechEnabled.value) return
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

const toggleSpeech = () => {
  isSpeechEnabled.value = !isSpeechEnabled.value
  speak(isSpeechEnabled.value ? '语音朗读已开启' : '')
}

const toggleInterest = (interest) => {
  const index = formData.value.interests.indexOf(interest)
  if (index === -1) {
    formData.value.interests.push(interest)
    speak(`已选择${interest}`)
  } else {
    formData.value.interests.splice(index, 1)
    speak(`取消选择${interest}`)
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    speak(`返回第${currentStep.value}步`)
  }
}

const nextStep = () => {
  if (!canProceed.value) {
    speak('请填写完当前步骤的必填项')
    return
  }

  if (currentStep.value < totalSteps) {
    currentStep.value++
    speak(`进入第${currentStep.value}步`)
  } else {
    submitSurvey()
  }
}

const submitSurvey = () => {
  if (isLoading.value) return
  isLoading.value = true
  
  speak('感谢您的填写，正在为您生成个性化主页')
  
  // 模拟保存数据到 Store 和 LocalStorage
  try {
    userStore.updateSurveyData(formData.value)
    if (formData.value.name) {
      userStore.userInfo.name = formData.value.name
    }
    
    // 简单加密模拟 (Base64) - 修复中文编码问题
    // btoa 只能处理 Latin1 字符，先用 encodeURIComponent 转码
    const jsonStr = JSON.stringify({
      phone: formData.value.phone,
      password: formData.value.password,
      security: { q: formData.value.securityQuestion, a: formData.value.securityAnswer }
    })
    const sensitiveData = btoa(encodeURIComponent(jsonStr))
    
    localStorage.setItem('user_sensitive_data', sensitiveData)
    
    setTimeout(() => {
      router.replace('/')
    }, 500)
  } catch (error) {
    console.error('Submit error:', error)
    isLoading.value = false
    speak('保存失败，请重试')
    alert('保存数据时出错，请重试或联系客服')
  }
}

// 自动保存进度
watch(formData, (newVal) => {
  localStorage.setItem('survey_progress', JSON.stringify(newVal))
}, { deep: true })
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
</style>
