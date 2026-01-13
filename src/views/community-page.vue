<template>
  <div class="w-full bg-slate-50 min-h-screen font-sans">
    <div class="mx-auto w-full max-w-[1000px] px-4 md:px-6 py-8">
      <!-- 页面头部 -->
      <header class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-600 text-3xl">forum</span>
            社区广场
          </h1>
          <p class="mt-2 text-slate-600">分享生活点滴，交流兴趣心得</p>
        </div>
        <div class="hidden md:flex items-center gap-3">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="搜索话题或内容..." 
              class="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            >
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- 左侧主内容区 -->
        <main class="lg:col-span-8 space-y-6">
          <!-- 发布器 -->
          <ContentPublisher @publish="onPublish" />

          <!-- 排序与筛选 -->
          <div class="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm">
            <div class="flex items-center gap-1">
              <button 
                v-for="sort in sortOptions" 
                :key="sort.value"
                class="px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                :class="currentSort === sort.value ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'"
                @click="currentSort = sort.value"
              >
                {{ sort.label }}
              </button>
            </div>
            <button class="flex items-center gap-1 text-sm text-slate-500 font-bold hover:text-slate-700">
              <span class="material-symbols-outlined text-lg">filter_list</span> 筛选
            </button>
          </div>

          <!-- 信息流列表 -->
          <div class="space-y-6">
            <FeedItem 
              v-for="post in posts" 
              :key="post.id" 
              :post="{
                ...post,
                user: {
                  ...post.user,
                  avatar: post.user.name === '我' ? userStore.userInfo.avatar : post.user.avatar
                }
              }"
              @like="onLike"
              @comment="onComment"
            />
            <div v-if="loading" class="py-8 text-center text-slate-500 flex flex-col items-center">
              <span class="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-2"></span>
              <span>正在加载更多精彩内容...</span>
            </div>
          </div>
        </main>

        <!-- 右侧侧边栏 -->
        <aside class="hidden lg:block lg:col-span-4 space-y-6">
          <!-- 热门话题 -->
          <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 class="font-black text-slate-900 mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-rose-500">local_fire_department</span>
              热门话题
            </h3>
            <div class="space-y-3">
              <a v-for="topic in hotTopics" :key="topic.id" href="#" class="block group">
                <div class="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors"># {{ topic.name }}</div>
                <div class="text-xs text-slate-400 mt-0.5">{{ topic.count }} 篇内容</div>
              </a>
            </div>
          </div>

          <!-- 活跃用户 -->
          <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 class="font-black text-slate-900 mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-500">workspace_premium</span>
              社区达人
            </h3>
            <div class="space-y-4">
              <div v-for="user in activeUsers" :key="user.id" class="flex items-center gap-3">
                <img :src="user.avatar" :alt="user.name" class="w-10 h-10 rounded-full object-cover border border-slate-100">
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-bold text-slate-900 truncate">{{ user.name }}</div>
                  <div class="text-xs text-slate-500 truncate">{{ user.bio }}</div>
                </div>
                <button class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors">
                  关注
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userStore } from '../store/userStore'
import ContentPublisher from '../components/community/ContentPublisher.vue'
import FeedItem from '../components/community/FeedItem.vue'

const currentSort = ref('newest')
const loading = ref(false)

const sortOptions = [
  { label: '最新发布', value: 'newest' },
  { label: '热门推荐', value: 'hot' },
  { label: '最多互动', value: 'interaction' }
]

const hotTopics = [
  { id: 1, name: '晒晒我的拿手菜', count: 1240 },
  { id: 2, name: '每日八段锦打卡', count: 856 },
  { id: 3, name: '手机摄影随手拍', count: 632 },
  { id: 4, name: '退休生活新规划', count: 428 }
]

const activeUsers = [
  { id: 1, name: '王大爷爱下棋', bio: '以棋会友，快乐每一天', avatar: './assets/community_img/4.jpg' },
  { id: 2, name: '张阿姨教编织', bio: '专注手工编织三十年', avatar: './assets/community_img/5.jpg' },
  { id: 3, name: '老李谈养生', bio: '科学养生，健康长寿', avatar: './assets/community_img/6.jpg' }
]

const posts = ref([
  {     
    id: 1, 
    user: {
      name: '赵老师',
      avatar: './assets/community_img/1.jpg',
      time: '2小时前'
    },
    content: '今天在社区公园教大家拍的秋叶，光线正好，构图用了三分法。大家觉得怎么样？欢迎交作业！',
    images: [
      './assets/community_img/秋2.jpg',
      './assets/community_img/秋1.jpg'
    ],
    tags: ['手机摄影', '秋日美景'],
    likes: 45,
    isLiked: false,
    comments: [
      { id: 101, user: '李阿姨', content: '赵老师拍得真好！我也去试试。', time: '1小时前' },
      { id: 102, user: '王大叔', content: '构图确实很讲究，学习了。', time: '30分钟前' }
    ]
  },
  {
    id: 2,
    user: {
      name: '孙奶奶',
      avatar:'./assets/community_img/2.jpg',
      time: '5小时前'
    },
    content: '第一次尝试做甜点，虽然卖相一般，但味道还不错。家里的小孙子特别爱吃！',
    images: [
      './assets/community_img/甜点.jpg'
    ],
    tags: ['烘焙', '美食分享'],
    likes: 128,
    isLiked: true,
    comments: []
  }
])

const onPublish = (newPost) => {
  posts.value.unshift({
    id: Date.now(),
    user: {
      name: '我',
      avatar: userStore.userInfo.avatar, // 使用 Store 中的头像
      time: '刚刚'
    },
    content: newPost.content,
    images: newPost.images || [],
    tags: newPost.tags || [],
    likes: 0,
    isLiked: false,
    comments: []
  })
}

const onLike = (postId) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.isLiked = !post.isLiked
    post.likes += post.isLiked ? 1 : -1
  }
}

const onComment = (postId, commentText) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.comments.push({
      id: Date.now(),
      user: '我',
      content: commentText,
      time: '刚刚'
    })
  }
}
</script>

<style scoped>
/* 隐藏滚动条但保留功能 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
