import { reactive } from 'vue'

const DEFAULT_AVATAR = './assets/community_img/user.png'

export const userStore = reactive({
  isLoggedIn: true, // 模拟已登录状态，实际应根据业务逻辑判断
  userInfo: {
    id: 'UID-882049',
    name: '王阿姨',
    avatar: DEFAULT_AVATAR, // 初始使用默认头像
    isSurveyCompleted: localStorage.getItem('isSurveyCompleted') === 'true'
  },
  
  updateAvatar(newAvatar) {
    this.userInfo.avatar = newAvatar
  },

  updateSurveyData(data) {
    this.userInfo = { ...this.userInfo, ...data }
    this.userInfo.isSurveyCompleted = true
    localStorage.setItem('isSurveyCompleted', 'true')
  },

  resetSurveyStatus() {
    this.userInfo.isSurveyCompleted = false
    localStorage.removeItem('isSurveyCompleted')
  },
  
  logout() {
    this.isLoggedIn = false
    this.userInfo = {
      id: '',
      name: '',
      avatar: DEFAULT_AVATAR,
      isSurveyCompleted: false
    }
    // 清除所有相关本地存储
    localStorage.removeItem('isSurveyCompleted')
    localStorage.removeItem('user_sensitive_data')
    localStorage.removeItem('survey_progress')
  },
  
  login(user) {
    this.isLoggedIn = true
    this.userInfo = { ...this.userInfo, ...user }
    if (!this.userInfo.avatar) {
      this.userInfo.avatar = DEFAULT_AVATAR
    }
  },
  
  logout() {
    this.isLoggedIn = false
    this.userInfo = {
      id: '',
      name: '',
      avatar: DEFAULT_AVATAR
    }
  }
})
