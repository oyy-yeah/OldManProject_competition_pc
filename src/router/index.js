import { createRouter, createWebHistory } from 'vue-router'

import Course from '../views/course.vue'
import DiscoverPage from '../views/discover-page.vue'
import CommunityPage from '../views/community-page.vue'
import StorePage from '../views/store-page.vue'
import MyPage from '../views/my.vue'
import NewLearnHome from '../views/newlearnHome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: NewLearnHome, meta: { title: '首页', showGlobalNav: false, fullWidth: true } },
    { path: '/course', name: 'CourseList', component: Course, meta: { title: '优质课程', showGlobalNav: true, fullWidth: false } },
    { path: '/course/:id', name: 'Course', component: Course, meta: { title: '优质课程', showGlobalNav: true, fullWidth: false } },
    { path: '/discover', name: 'Discover', component: DiscoverPage, meta: { title: '发现', showGlobalNav: true, fullWidth: false } },
    { path: '/community', name: 'Community', component: CommunityPage, meta: { title: '社区', showGlobalNav: true, fullWidth: false } },
    { path: '/store', name: 'Store', component: StorePage, meta: { title: '商店', showGlobalNav: true, fullWidth: false } },
    { path: '/my', name: 'My', component: MyPage, meta: { title: '个人中心', showGlobalNav: true, fullWidth: false } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'Course') {
    const id = to.params?.id
    if (typeof id !== 'string' || !/^c-\\d+$/.test(id)) {
      next({ path: '/course' })
      return
    }
  }
  next()
})

router.afterEach((to) => {
  const title = typeof to.meta?.title === 'string' ? to.meta.title : ''
  if (title) document.title = title
})

export default router
