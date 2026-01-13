<template>
  <div class="w-full bg-slate-50 min-h-screen font-sans pb-16">
    <div class="mx-auto w-full max-w-[1200px] px-4 md:px-6 py-8">
      <!-- 页面头部 -->
      <header class="mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-500 text-3xl">storefront</span>
            积分商店
          </h1>
          <p class="mt-2 text-slate-600">学习娱乐攒积分，好礼免费换回家</p>
        </div>
        
        <!-- 积分卡片 -->
        <div class="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-4 min-w-[240px]">
          <div class="p-2 bg-white/20 rounded-full">
            <span class="material-symbols-outlined text-3xl">monetization_on</span>
          </div>
          <div>
            <div class="text-sm font-medium text-amber-100">当前积分</div>
            <div class="text-3xl font-black tracking-tight">{{ userPoints }}</div>
          </div>
          <button class="ml-auto text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors" @click="showHistory = true">
            兑换记录
          </button>
        </div>
      </header>

      <!-- 分类与搜索 -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all"
            :class="selectedCategory === cat.id ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:bg-slate-50'"
            @click="selectedCategory = cat.id"
          >
            {{ cat.name }}
          </button>
        </div>
        
        <div class="relative w-full md:w-64">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索商品..." 
            class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
          >
        </div>
      </div>

      <!-- 商品列表 -->
      <div v-if="loading" class="py-20 text-center">
        <span class="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin inline-block"></span>
        <p class="mt-4 text-slate-500">正在加载精选好礼...</p>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="py-20 text-center bg-white rounded-3xl border border-slate-100">
        <span class="material-symbols-outlined text-6xl text-slate-300 mb-4">production_quantity_limits</span>
        <p class="text-slate-500 text-lg">暂无相关商品</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
        >
          <div class="relative h-48 overflow-hidden bg-slate-100">
            <img :src="product.image" :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div v-if="product.stock <= 5" class="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
              仅剩 {{ product.stock }} 件
            </div>
          </div>
          
          <div class="p-5 flex flex-col flex-1">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="text-lg font-bold text-slate-900 leading-tight line-clamp-2">{{ product.name }}</h3>
            </div>
            <p class="text-slate-500 text-sm mb-4 line-clamp-2">{{ product.desc }}</p>
            
            <div class="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
              <div class="text-amber-600 font-black text-xl flex items-center gap-1">
                {{ product.points }} <span class="text-xs font-bold text-amber-500/80">积分</span>
              </div>
              <button 
                class="px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
                :class="canRedeem(product) ? 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-amber-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
                :disabled="!canRedeem(product)"
                @click="initiateRedeem(product)"
              >
                {{ getButtonText(product) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 兑换确认弹窗 -->
    <div v-if="confirmModal.show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl animate-scale-up">
        <div class="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-4xl">redeem</span>
        </div>
        <h3 class="text-xl font-black text-slate-900 mb-2">确认兑换此商品？</h3>
        <p class="text-slate-600 mb-2">{{ confirmModal.product.name }}</p>
        <div class="text-2xl font-black text-amber-600 mb-6">{{ confirmModal.product.points }} 积分</div>
        
        <div class="grid grid-cols-2 gap-3">
          <button @click="confirmModal.show = false" class="py-3 text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            取消
          </button>
          <button @click="confirmRedeem" class="py-3 bg-amber-500 text-white font-bold rounded-xl shadow-lg hover:bg-amber-600 transition-all">
            确认兑换
          </button>
        </div>
      </div>
    </div>

    <!-- 兑换成功弹窗 -->
    <div v-if="successModal.show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-scale-up">
        <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="material-symbols-outlined text-5xl">check_circle</span>
        </div>
        <h3 class="text-2xl font-black text-slate-900 mb-2">兑换成功！</h3>
        <p class="text-slate-600 mb-6">您的礼品已在准备中，请留意系统通知。</p>
        <button @click="successModal.show = false" class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all">
          好的
        </button>
      </div>
    </div>

    <!-- 历史记录侧边栏 -->
    <div v-if="showHistory" class="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm" @click.self="showHistory = false">
      <div class="w-full max-w-md bg-white h-full shadow-2xl animate-slide-in p-6 flex flex-col">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-black text-slate-900">兑换记录</h2>
          <button @click="showHistory = false" class="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div v-if="redemptionHistory.length === 0" class="flex-1 flex flex-col items-center justify-center text-slate-400">
          <span class="material-symbols-outlined text-6xl mb-4 text-slate-200">history</span>
          <p>暂无兑换记录</p>
        </div>

        <div v-else class="flex-1 overflow-y-auto space-y-4 pr-2">
          <div v-for="record in redemptionHistory" :key="record.id" class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div class="flex justify-between items-start mb-2">
              <h4 class="font-bold text-slate-900">{{ record.productName }}</h4>
              <span class="text-amber-600 font-bold text-sm">-{{ record.points }}</span>
            </div>
            <div class="flex justify-between items-center text-xs text-slate-500">
              <span>{{ record.date }}</span>
              <span 
                class="px-2 py-0.5 rounded-md font-bold"
                :class="record.status === '已发货' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'"
              >
                {{ record.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 模拟用户数据
const userPoints = ref(2850)
const loading = ref(false)
const showHistory = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('all')

// 弹窗状态
const confirmModal = ref({ show: false, product: null })
const successModal = ref({ show: false })

const categories = [
  { id: 'all', name: '全部商品' },
  { id: 'health', name: '健康保健' },
  { id: 'daily', name: '生活日用' },
  { id: 'virtual', name: '虚拟权益' },
  { id: 'food', name: '粮食大米' }
]

const products = ref([
  {
    id: 1,
    name: '多功能颈椎按摩仪',
    desc: '仿真人手按摩，恒温热敷，缓解颈椎疲劳。',
    points: 1688,
    image: './assets/store_img/多功能颈椎按摩仪.jpg',
    category: 'health',
    stock: 12
  },
  {
    id: 2,
    name: '智能保温杯 500ml',
    desc: '数显温度，长效保温，食品级304不锈钢材质。',
    points: 888,
    image: './assets/store_img/保温杯.jpg',
    category: 'daily',
    stock: 45
  },
  {
    id: 3,
    name: '有机五常大米 5kg',
    desc: '产地直供，颗粒饱满，饭香浓郁。',
    points: 1288,
    image: './assets/store_img/5kg大米.jpg',
    category: 'food',
    stock: 8
  },
  {
    id: 4,
    name: '视频会员月卡',
    desc: '畅看海量高清影视剧，无广告打扰。',
    points: 688,
    image: './assets/store_img/会员卡.jpg',
    category: 'virtual',
    stock: 999
  },
  {
    id: 5,
    name: '家用电子血压计',
    desc: '一键测量，语音播报，大屏显示更清晰。',
    points: 2188,
    image: './assets/store_img/血压仪.jpg',
    category: 'health',
    stock: 3
  },
  {
    id: 6,
    name: '全棉舒适毛巾套装',
    desc: '精选新疆长绒棉，吸水性强，柔软亲肤。',
    points: 688,
    image: './assets/store_img/毛巾.jpg',
    category: 'daily',
    stock: 60
  },
  {
    id: 7,
    name: '鸡蛋',
    desc: '新鲜鸡蛋，无籽，100%自然。',
    points: 188,
    image: './assets/store_img/鸡蛋.jpg',
    category: 'food',
    stock: 20
  }
  
])

const redemptionHistory = ref([
  { id: 101, productName: '无糖燕麦片礼盒', points: 600, date: '2023-10-15 14:30', status: '已发货' },
  { id: 102, productName: '超市购物卡 50元', points: 500, date: '2023-09-28 09:15', status: '已完成' }
])

// 计算过滤后的商品
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchCat = selectedCategory.value === 'all' || p.category === selectedCategory.value
    const matchSearch = p.name.includes(searchQuery.value) || p.desc.includes(searchQuery.value)
    return matchCat && matchSearch
  })
})

const canRedeem = (product) => {
  return userPoints.value >= product.points && product.stock > 0
}

const getButtonText = (product) => {
  if (product.stock <= 0) return '已抢光'
  if (userPoints.value < product.points) return '积分不足'
  return '立即兑换'
}

const initiateRedeem = (product) => {
  confirmModal.value = { show: true, product }
}

const confirmRedeem = () => {
  const product = confirmModal.value.product
  
  if (userPoints.value >= product.points && product.stock > 0) {
    // 扣除积分
    userPoints.value -= product.points
    // 扣除库存
    product.stock--
    // 添加记录
    redemptionHistory.value.unshift({
      id: Date.now(),
      productName: product.name,
      points: product.points,
      date: new Date().toLocaleString(),
      status: '处理中'
    })
    
    confirmModal.value.show = false
    setTimeout(() => {
      successModal.value.show = true
    }, 300)
  }
}

// 模拟加载
onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 600)
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in { animation: slideIn 0.3s ease-out forwards; }

@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
</style>
