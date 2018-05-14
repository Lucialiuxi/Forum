import Vue from 'vue'
import Router from 'vue-router'

import  Home from '@/views/home/home.vue'
import  Detail from '@/views/detail/detail.vue'
import  User from '@/views/user/user.vue'
import  UserTopicsDetail from '@/views/user/userTopicsDetail.vue'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/detail/:abc',
      name: 'Detail',
      component: Detail,
      props: true,  // 给使用的组件传入props，props的key值就是abc
    },
    {
      path: '/user/:loginname',
      name: 'User',
      component: User,
      props: true,  // 给使用的组件传入props，props的key值就是id
    },
    {
      path: '/:u/:userLoginName/:p',
      name: 'UserTopicsDetail',
      component: UserTopicsDetail,
      props: true
    },
    {//没有匹配到路由就重定向到根路径
      path: '*',
      redirect: '/'
    },
  ]
})
