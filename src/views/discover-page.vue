<template>
  <div class="w-full bg-slate-50 text-slate-900 font-sans">
    <!-- Hero Section -->
    <div class="relative w-full h-[360px] md:h-[480px] bg-cover bg-center" :style="{ backgroundImage: `url(${heroImage})` }">
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center text-white px-4 max-w-2xl animate-fade-in-up">
          <h1 class="text-3xl md:text-5xl font-black tracking-tight drop-shadow-md">发现您的多彩生活</h1>
          <p class="mt-4 text-lg md:text-xl font-medium text-white/90 drop-shadow-sm">
            加入兴趣小组，参与精彩活动，结识志同道合的新朋友
          </p>
          <button class="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-transform transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50">
            立即探索
          </button>
        </div>
      </div>
    </div>

    <!-- Game Hub Integration -->
    <div v-if="showGameHub" class="fixed inset-0 z-50 overflow-y-auto bg-slate-50 animate-fade-in">
      <GameHub @back="showGameHub = false" />
    </div>

    <main class="mx-auto w-full max-w-[1280px] px-4 md:px-6 py-16">
      <!-- Brain Games Entry Card -->
      <section class="mb-16">
        <div 
          class="relative bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white shadow-xl overflow-hidden cursor-pointer transform hover:scale-[1.01] transition-all duration-300"
          @click="showGameHub = true"
          role="button"
          tabindex="0"
          aria-label="进入益智游戏专区"
        >
          <div class="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-12"></div>
          <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="bg-white/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">新功能</span>
                <span class="flex items-center gap-1 text-yellow-300 font-bold">
                  <span class="material-symbols-outlined text-xl">star</span> 每日挑战
                </span>
              </div>
              <h2 class="text-3xl md:text-4xl font-black mb-2">益智游戏专区</h2>
              <p class="text-lg md:text-xl text-indigo-100 max-w-xl">
                专为长辈设计的脑力训练营，包含记忆配对、数字华容道、数独等经典游戏。
                <br class="hidden md:block" />
                每天玩十分钟，保持大脑年轻活力！
              </p>
            </div>
            <button class="px-8 py-3 bg-white text-indigo-600 font-bold rounded-full shadow-lg hover:bg-indigo-50 transition-colors flex items-center gap-2">
              开始游戏 <span class="material-symbols-outlined">play_circle</span>
            </button>
          </div>
          <!-- Decorative Icons -->
          <span class="material-symbols-outlined absolute bottom-4 right-20 text-white/20 text-8xl rotate-12">extension</span>
          <span class="material-symbols-outlined absolute top-8 right-8 text-white/20 text-6xl -rotate-12">psychology</span>
        </div>
      </section>

      <!-- Interest Groups Section -->
      <section aria-labelledby="group-section-title" class="mb-20">
        <div class="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 id="group-section-title" class="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-600 text-3xl">diversity_3</span>
              兴趣小组
            </h2>
            <p class="mt-2 text-slate-600 text-lg">按分类探索，加入同好圈子</p>
          </div>
          <a class="hidden md:flex items-center gap-1 text-blue-600 font-bold text-lg hover:underline transition-colors" href="#" aria-label="查看更多兴趣小组">
            查看更多 <span class="material-symbols-outlined text-xl">arrow_forward</span>
          </a>
        </div>

        <!-- Categories Tabs -->
        <div class="mb-8 -mx-4 px-4 overflow-x-auto" role="navigation" aria-label="兴趣小组分类">
          <div class="flex items-center gap-3 whitespace-nowrap pb-2">
            <button
              v-for="c in groupCategories"
              :key="c"
              type="button"
              class="group relative min-h-[48px] px-6 inline-flex items-center justify-center rounded-full text-base font-bold transition-all duration-300 ease-out border-2"
              :class="selectedGroupCategory === c 
                ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'"
              :aria-pressed="selectedGroupCategory === c ? 'true' : 'false'"
              @click="onSelectGroupCategory(c)"
            >
              {{ c }}
              <span v-if="selectedGroupCategory === c" class="absolute -bottom-1 left-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full -translate-x-1/2 translate-y-full"></span>
            </button>
          </div>
        </div>

        <!-- Groups Grid -->
        <div class="relative min-h-[300px]">
          <div v-if="groupLoading" class="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-xl" aria-live="polite">
            <span class="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></span>
            <span class="mt-3 text-slate-600 font-medium">正在加载小组...</span>
          </div>
          
          <div v-else-if="filteredGroups.length === 0" class="flex flex-col items-center justify-center py-20 bg-slate-100 rounded-2xl text-slate-500">
            <span class="material-symbols-outlined text-6xl text-slate-300 mb-4">search_off</span>
            <p class="text-lg">当前分类暂无小组</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" role="list" aria-label="兴趣小组列表">
            <article
              v-for="g in filteredGroups"
              :key="g.id"
              role="listitem"
              class="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div class="relative h-48 overflow-hidden">
                <img 
                  :src="g.cover" 
                  :alt="g.name" 
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div class="absolute top-3 right-3">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm shadow-sm" :class="g.active ? 'text-emerald-600' : 'text-slate-500'">
                    <span class="material-symbols-outlined text-sm filled">{{ g.active ? 'bolt' : 'schedule' }}</span>
                    {{ g.active ? '活跃' : '一般' }}
                  </span>
                </div>
              </div>
              
              <div class="p-6 flex flex-col flex-1">
                <h3 class="text-xl font-black text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{{ g.name }}</h3>
                <p class="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">{{ g.desc }}</p>
                
                <div class="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div class="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                    <span class="material-symbols-outlined text-lg">group</span>
                    <span>{{ g.members }} 成员</span>
                  </div>
                  <button
                    type="button"
                    class="px-5 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 text-sm"
                    aria-label="加入小组"
                    @click="onJoinGroup(g.id)"
                  >
                    加入
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Events Section -->
      <section aria-labelledby="events-section-title">
        <div class="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 id="events-section-title" class="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2">
              <span class="material-symbols-outlined text-orange-500 text-3xl">event_available</span>
              近期活动
            </h2>
            <p class="mt-2 text-slate-600 text-lg">线上与线下结合，丰富社交与学习</p>
          </div>
          <a class="hidden md:flex items-center gap-1 text-blue-600 font-bold text-lg hover:underline transition-colors" href="#" aria-label="查看更多活动">
            查看更多 <span class="material-symbols-outlined text-xl">arrow_forward</span>
          </a>
        </div>

        <div v-if="events.length === 0" class="flex flex-col items-center justify-center py-20 bg-slate-100 rounded-2xl text-slate-500">
          <span class="material-symbols-outlined text-6xl text-slate-300 mb-4">event_busy</span>
          <p class="text-lg">近期暂无活动，敬请期待</p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8" role="list" aria-label="活动列表">
          <article
            v-for="ev in events"
            :key="ev.id"
            role="listitem"
            class="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-full"
          >
            <div class="relative w-full md:w-2/5 h-56 md:h-auto overflow-hidden">
              <img 
                :src="ev.cover" 
                :alt="ev.title" 
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div class="absolute top-3 left-3">
                <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md" 
                  :class="ev.type === 'online' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'">
                  <span class="material-symbols-outlined text-sm filled">{{ ev.type === 'online' ? 'videocam' : 'location_on' }}</span>
                  {{ ev.type === 'online' ? '线上活动' : '线下活动' }}
                </span>
              </div>
            </div>

            <div class="p-6 flex flex-col justify-between flex-1">
              <div>
                <h3 class="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{{ ev.title }}</h3>
                
                <div class="space-y-2 mb-6">
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-slate-400 text-xl mt-0.5">schedule</span>
                    <div>
                      <span class="block text-sm text-slate-500 font-medium">时间</span>
                      <span class="text-base font-bold text-slate-800">{{ ev.time }}</span>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="material-symbols-outlined text-slate-400 text-xl mt-0.5">map</span>
                    <div>
                      <span class="block text-sm text-slate-500 font-medium">地点</span>
                      <span class="text-base font-bold text-slate-800">{{ ev.location }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-100">
                <div class="text-sm text-slate-500">
                  <span class="font-bold text-slate-900">{{ ev.joined || 0 }}</span> 人已报名
                </div>
                <button
                  type="button"
                  class="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-md shadow-blue-200 hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                  aria-label="立即报名"
                  @click="onRegister(ev.id)"
                >
                  立即报名
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import GameHub from '../components/games/GameHub.vue'

const showGameHub = ref(false)
const heroImage = './assets/discover_img/朋友.jpg'

const groupCategories = ['健康养生', '书法绘画', '广场舞', '棋牌娱乐']
const selectedGroupCategory = ref(groupCategories[0])
const groupLoading = ref(false)

const groups = ref([
  { 
    id: 'g-1', 
    name: '晨练养生群', 
    desc: '共同学习八段锦，规律作息更健康。每天早晨7点，我们不见不散！', 
    members: 86, 
    active: true, 
    category: '健康养生',
    cover: './assets/discover_img/养生.jpg'
  },
  { 
    id: 'g-2', 
    name: '邻里书法社', 
    desc: '楷书入门，每周作品交流与点评。欢迎各位墨友加入，以字会友。', 
    members: 52, 
    active: true, 
    category: '书法绘画',
    cover: './assets/discover_img/书法.jpg'
  },
  { 
    id: 'g-3', 
    name: '广场舞团', 
    desc: '每晚八点，乐享舞动时光。不管是新手还是老手，都欢迎加入！', 
    members: 120, 
    active: true, 
    category: '广场舞',
    cover: './assets/discover_img/广场舞.jpg'
  },
  { 
    id: 'g-4', 
    name: '棋牌欢乐汇', 
    desc: '象棋、围棋、斗地主，轻松有趣。闲暇时光，来切磋两把！', 
    members: 40, 
    active: true, 
    category: '棋牌娱乐',
    cover: './assets/discover_img/象棋.jpg'
  }
])

const filteredGroups = computed(() => groups.value.filter(g => g.category === selectedGroupCategory.value))

const onSelectGroupCategory = (cat) => {
  if (selectedGroupCategory.value === cat) return
  groupLoading.value = true
  selectedGroupCategory.value = cat
  setTimeout(() => { groupLoading.value = false }, 400)
}

const events = ref([
  { 
    id: 'e-1', 
    title: '线上养生课堂：经络按摩入门', 
    time: '周三 14:00-15:30', 
    location: '腾讯会议', 
    audience: '50岁以上', 
    type: 'online', 
    contact: '群助手私信报名',
    joined: 128,
    cover: './assets/discover_img/按摩.jpg'
  },
  { 
    id: 'e-2', 
    title: '线下书法体验课：楷书临摹', 
    time: '周六 09:30-11:00', 
    location: '社区活动中心A厅', 
    audience: '不限年龄', 
    type: 'offline', 
    contact: '前台登记',
    joined: 45,
    cover: './assets/discover_img/书法课.jpg'
  },
  { 
    id: 'e-3', 
    title: '广场舞编排交流会', 
    time: '周日 19:00-20:30', 
    location: '文化广场南侧', 
    audience: '喜爱舞蹈的朋友', 
    type: 'offline', 
    contact: '现场报名',
    joined: 62,
    cover: './assets/discover_img/广场舞编排.jpg'
  }
])

const onJoinGroup = (groupId) => {
  void groupId
}

const onRegister = (eventId) => {
  void eventId
}
</script>

<style scoped>
/* 增加 Material Symbols 填充样式的类 */
.material-symbols-outlined.filled {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
