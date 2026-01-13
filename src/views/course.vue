<template>
  <div class="w-full bg-slate-50 text-slate-900">
    <main class="mx-auto w-full max-w-[1200px] px-4 md:px-6 py-12">
      <div class="flex items-end justify-between gap-6">
        <div>
          <div class="text-2xl font-black">优质课程</div>
          <div class="mt-2 text-slate-500">精选内容，轻松学习，循序渐进</div>
        </div>
        <div class="hidden md:flex items-center gap-3">
          
        </div>
      </div>

      <div class="mt-6 -mx-2 overflow-x-auto" aria-label="课程分类">
        <div class="flex items-center gap-3 px-2 whitespace-nowrap">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="min-h-[48px] h-12 px-4 inline-flex items-center justify-center rounded-xl border-b-2 transition-all duration-200 ease-out"
            :class="
              selectedCategory === cat
                ? 'bg-blue-600 text-white font-bold border-blue-700'
                : 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200 hover:text-slate-900'
            "
            :aria-pressed="selectedCategory === cat ? 'true' : 'false'"
            @click="onSelectCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="mt-4 inline-flex items-center gap-2 text-slate-600" aria-live="polite">
        <span class="inline-block w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></span>
        <span class="text-sm">分类切换中...</span>
      </div>
      <div v-else-if="filteredCourses.length === 0" class="mt-6 text-slate-500">当前分类暂未上架课程</div>

      <section class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="course in filteredCourses"
          :key="course.id"
          class="border border-slate-200 bg-white shadow-sm overflow-hidden nlh-rounded flex flex-col"
        >
          <div class="h-40 bg-cover bg-center" :style="{ backgroundImage: `url(${course.coverUrl})` }"></div>
          <div class="p-5 flex flex-col gap-3 flex-1">
            <div>
              <div class="font-extrabold text-slate-900 text-[18px] leading-snug">{{ course.title }}</div>
              <div class="mt-1 text-sm text-slate-500">讲师：{{ course.instructor }}</div>
            </div>

            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-2" :aria-label="`评分 ${course.rating} / 5`" role="img">
                <div class="flex items-center gap-0.5">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="material-symbols-outlined text-[18px]"
                    :class="n <= Math.round(course.rating) ? 'text-blue-600' : 'text-slate-300'"
                  >
                    star
                  </span>
                </div>
                <div class="text-sm font-bold text-slate-700">{{ course.rating.toFixed(1) }}</div>
              </div>
              <div class="text-xs text-slate-500">{{ course.learners }}人已学</div>
            </div>

            <div class="mt-auto flex items-center gap-3">
              <div class="flex-1">
                <div class="text-xs text-slate-500">难度</div>
                <div class="text-sm font-bold text-slate-700">{{ course.level }}</div>
              </div>
              <button
                type="button"
                class="w-[160px] bg-blue-600 text-white font-bold py-3 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                aria-label="报名课程"
                @click="onEnroll(course.id)"
              >
                开始学习
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const courses = ref([
  {
    id: 'c-1',
    title: '电脑操作基础课：从零学会常用操作',
    instructor: '李老师',
    rating: 4.8,
    learners: 1240,
    level: '入门',
    coverUrl: ''
  },
  {
    id: 'c-2',
    title: '手机摄影入门：轻松拍出更好看的照片',
    instructor: '陈老师',
    rating: 4.6,
    learners: 980,
    level: '入门',
     coverUrl: '' 
  },
  {
    id: 'c-3',
    title: '健康养生课堂：每天进步一点点',
    instructor: '王老师',
    rating: 4.7,
    learners: 1530,
    level: '基础',
    coverUrl: ''
  },
  {
    id: 'c-4',
    title: '微信进阶：视频通话与群聊技巧',
    instructor: '周老师',
    rating: 4.5,
    learners: 760,
    level: '基础',
    coverUrl: ''
  },
  {
    id: 'c-5',
    title: '网络安全：识别诈骗与保护隐私',
    instructor: '赵老师',
    rating: 4.9,
    learners: 2040,
    level: '必修',
     coverUrl: ''
  },
  {
    id: 'c-6',
    title: '出行助手：使用数字地图与公交查询',
    instructor: '孙老师',
    rating: 4.4,
    learners: 610,
    level: '入门',
     coverUrl: ''
  },
  {
    id: 'c-7',
    title: '短视频剪辑：手机也能剪大片',
    instructor: '郑老师',
    rating: 4.7,
    learners: 1320,
    level: '入门',
     coverUrl: ''
  },
  {
    id: 'c-8',
    title: '在线挂号：轻松预约医院与体检',
    instructor: '钱老师',
    rating: 4.5,
    learners: 890,
    level: '基础',
    coverUrl: ''
  },
  {
    id: 'c-9',
    title: '手机支付：安全使用微信与支付宝',
    instructor: '冯老师',
    rating: 4.9,
    learners: 2180,
    level: '必修',
     coverUrl: ''
  },
  {
    id: 'c-10',
    title: '家庭K歌：手机点歌与音响连接',
    instructor: '吴老师',
    rating: 4.3,
    learners: 560,
    level: '入门',
     coverUrl: ''
  },
  {
    id: 'c-10',
    title: '家庭K歌：手机点歌与音响连接',
    instructor: '吴老师',
    rating: 4.3,
    learners: 560,
    level: '入门',
     coverUrl: ''
  },
  {
    id: 'c-10',
    title: '家庭K歌：手机点歌与音响连接',
    instructor: '吴老师',
    rating: 4.3,
    learners: 560,
    level: '入门',
     coverUrl: ''
  }
])

const categories = ['传统技艺', '美食', '运动', '文化表达', '智能设备', '生活服务']
const selectedCategory = ref('智能设备')
const loading = ref(false)

const categoriesMap = {
  'c-1': '智能设备',
  'c-2': '智能设备',
  'c-3': '运动',
  'c-4': '智能设备',
  'c-5': '生活服务',
  'c-6': '生活服务',
  'c-7': '智能设备',
  'c-8': '生活服务',
  'c-9': '生活服务',
  'c-10': '文化表达'
}

const onSelectCategory = (cat) => {
  if (selectedCategory.value === cat) return
  loading.value = true
  selectedCategory.value = cat
  setTimeout(() => { loading.value = false }, 300)
}

const filteredCourses = computed(() => courses.value.filter(c => categoriesMap[c.id] === selectedCategory.value))

const router = useRouter()
const onEnroll = (courseId) => {
  router.push({ name: 'Course', params: { id: courseId } })
}
</script>

<style scoped>
.nlh-rounded { border-radius: 14px !important; }
</style>
