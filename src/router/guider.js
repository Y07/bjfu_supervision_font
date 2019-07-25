// 动态问卷相关的路由配置
import MainGuider from '_c/mainGuider'
import parentView from '@/components/parent-view'

export default {
  name: '督导端',
  path: '/_guider',
  meta: {
    icon: 'ios-book',
    hideInMenu: true
  },
  component: MainGuider, // 一级目录必须使用Main组件作为component，
  children: [{
    name: 'guider_active_attend',
    meta: {
      title: '督导报名中心'
    },
    path: 'attend',
    component: resolve => require(['Views/ActiveAttend/index'], resolve)
  },
  {
    name: 'guider_consult_apply',
    meta: {
      title: '督导咨询申请'
    },
    path: 'consult_apply',
    component: resolve => require(['Views/ConsultApply/index'], resolve)
  },
  {
    name: 'guider_form_choose',
    meta: {
      title: '督导问卷填写'
    },
    path: 'judge',
    component: resolve => require(['Views/GuiderFormChoose/index'], resolve)
  },
  {
    name: 'guider_lesson_form',
    meta: {
      title: '课程表'
    },
    path: 'lesson_form',
    component: resolve => require(['Views/GuiderLessonForm/index'], resolve)
  },
  {
    name: 'guider_form_fill',
    path: 'judge/form_fill/:name/:version',
    component: resolve => require(['Views/FormFill/index'], resolve)
  },
  {
    name: '督导问卷查看',
    path: 'judge/form_show/:id',
    component: resolve => require(['Views/FormShow/index'], resolve)
  },
  {
    name: '督导我的提交',
    path: 'my_form',
    component: resolve => require(['Views/FormsMy/index'], resolve)
  },
  {
    path: 'profile/:username', // xzl
    name: '督导用户详情页',
    meta: {
      hideInMenu: true
    },
    component: resolve => require(['Views/Profile/index'], resolve)
  },
  {
    name: '督导关注课程',
    path: 'notice_lesson',
    component: resolve => require(['Views/GuiderNoticeLesson/index'], resolve)
  },
  {
    name: '督导好评课程',
    path: 'lesson_model',
    component: resolve => require(['Views/GuiderModelLesson/index.vue'], resolve)
  },
  {
    name: '督导学院教学院长',
    path: 'leader_lookup',
    component: resolve => require(['Views/UserSuperManager/index.vue'], resolve)
  }
  ]
}
