import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Regist from '@/components/Regist'
import Report from '@/components/Report'
import Theme from '@/components/Theme'
import Content from '@/components/Content'
import Module from '@/components/Module'
import Occupation from '@/components/Occupation'
import Member from '@/components/Member'
import Tag from '@/components/Tag'

Vue.use(Router)

export default new Router({
  base: '/bbs/',
  mode: 'history',
  routes: [
    {
      path: '/regist',
      name: 'regist',
      component: Regist
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/report',
      name: 'report',
      component: Report
    }, {
      path: '/themes',
      name: 'themes',
      component: Theme
    }, {
      path: '/content/:id/:level/:uid',
      name: 'content',
      component: Content
    }, {
      path: '/module',
      name: 'module',
      component: Module
    }, {
      path: '/occupation',
      name: 'occupation',
      component: Occupation,
      children: [
        {
          path: 'member',
          name: 'member',
          component: Member
        }, {
          path: 'tag',
          name: 'tag',
          component: Tag
        }
      ],
      redirect: '/occupation/member'
    }
  ]
})
